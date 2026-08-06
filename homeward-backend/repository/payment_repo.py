from database import supabase
from models.schemas import PaymentCreateRequest
from datetime import datetime
import uuid

class PaymentRepository:
    def create_payment(self, member_id: str, payload: PaymentCreateRequest, member_name: str) -> dict:
        # Use the date picked by the user, or default to current UTC time
        timestamp_val = payload.paidOn if payload.paidOn else datetime.utcnow().isoformat()
        
        data = {
            "id": f"pay_{uuid.uuid4().hex[:8]}",
            "member_id": member_id,
            "member_name": member_name,
            "amount": payload.amount,
            "timestamp": timestamp_val,
            "is_milestone": False
        }
        
        response = supabase.table("payments").insert(data).execute()
        return response.data[0]
        
    def get_payments_by_member(self, member_id: str, limit: int = 10) -> list:
        response = supabase.table("payments") \
            .select("*") \
            .eq("member_id", member_id) \
            .order("timestamp", desc=True) \
            .limit(limit) \
            .execute()
            
        return response.data


    def get_payments_by_household(self, household_id: str, limit: int = 20) -> list:
        # Find all members in this household first
        members_resp = supabase.table("members").select("id").eq("household_id", household_id).execute()
        member_ids = [m["id"] for m in members_resp.data]
        
        if not member_ids:
            return []
            
        response = supabase.table("payments") \
            .select("*") \
            .in_("member_id", member_ids) \
            .order("timestamp", desc=True) \
            .limit(limit) \
            .execute()
            
        return response.data

    def delete_payment(self, payment_id: str) -> bool:
            response = supabase.table("payments").delete().eq("id", payment_id).execute()
            return len(response.data) > 0