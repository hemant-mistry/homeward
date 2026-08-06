from database import supabase

class DashboardRepository:
    def get_household_details(self, household_id: str):
        response = supabase.table("households") \
            .select("*") \
            .eq("id", household_id) \
            .execute()
            
        if not response or not response.data:
            return None
            
        return response.data[0]

    def get_household_payments(self, household_id: str):
        # 1. Fetch all member IDs belonging to this household
        members_resp = supabase.table("members") \
            .select("id") \
            .eq("household_id", household_id) \
            .execute()
            
        if not members_resp or not members_resp.data:
            return []
            
        member_ids = [m["id"] for m in members_resp.data]
        
        if not member_ids:
            return []

        # 2. Fetch all payments made by these members
        payments_resp = supabase.table("payments") \
            .select("*") \
            .in_("member_id", member_ids) \
            .execute()
            
        if not payments_resp or not payments_resp.data:
            return []
            
        return payments_resp.data