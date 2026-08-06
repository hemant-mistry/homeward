from fastapi import HTTPException
from database import supabase
from repository.payment_repo import PaymentRepository
from models.schemas import PaymentCreateRequest

class PaymentService:
    def __init__(self):
        self.payment_repo = PaymentRepository()

    def add_payment(self, member_id: str, payload: PaymentCreateRequest):
        try:
            # 1. Fetch the member's name from Supabase using their member_id
            member_resp = supabase.table("members").select("name").eq("id", member_id).execute()
            member_name = "Family Member"
            if member_resp and member_resp.data:
                member_name = member_resp.data[0].get("name", "Family Member")

            # 2. Pass member_name into the repository method
            return self.payment_repo.create_payment(member_id, payload, member_name)
        except Exception as e:
            print(f"Error adding payment: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def fetch_payment_history(self, member_id: str, limit: int):
        return self.payment_repo.get_payments_by_member(member_id, limit)

    def fetch_household_payment_history(self, household_id: str, limit: int = 20):
        return self.payment_repo.get_payments_by_household(household_id, limit)

    def remove_payment(self, payment_id: str):
        success = self.payment_repo.delete_payment(payment_id)
        if not success:
            raise HTTPException(status_code=404, detail="Payment not found")
        return {"status": "success", "message": "Payment deleted"}