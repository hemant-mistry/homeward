from database import supabase

class AccessRepository:
    def get_member_by_access_key(self, access_key: str) -> dict:
        # We use Supabase's foreign key joining to fetch the household name in one query
        response = supabase.table("members") \
            .select("id, name, role, household_id, households(name)") \
            .eq("access_key", access_key) \
            .maybe_single() \
            .execute()
        return response.data