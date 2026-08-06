from database import supabase

class DashboardRepository:
    def get_household_details(self, household_id: str):
        response = supabase.table("households") \
            .select("total_loan_amount") \
            .eq("id", household_id) \
            .maybe_single() \
            .execute()
        return response.data

    def get_total_payments_for_household(self, household_id: str) -> float:
        # Step 1: Find all members of this household
        members_resp = supabase.table("members").select("id").eq("household_id", household_id).execute()
        member_ids = [m["id"] for m in members_resp.data]
        
        if not member_ids:
            return 0.0
            
        # Step 2: Fetch all payments from those members and sum them up
        payments_resp = supabase.table("payments").select("amount").in_("member_id", member_ids).execute()
        return sum(p["amount"] for p in payments_resp.data)