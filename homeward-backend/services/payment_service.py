from fastapi import HTTPException

from repository.payment_repo import PaymentRepository
from models.schemas import PaymentCreateRequest

class PaymentService:
    def __init__(self):
        self.payment_repo = PaymentRepository()

    def log_new_payment(self, member_id: str, payload: PaymentCreateRequest):
        # MOCK: In the future, fetch the actual member name from an Auth service
        member_name = "Hemant" 
        
        return self.payment_repo.create_payment(member_id, payload, member_name)

    def fetch_payment_history(self, member_id: str, limit: int):
        return self.payment_repo.get_payments_by_member(member_id, limit)

    def fetch_household_payment_history(self, household_id: str, limit: int = 20):
        return self.payment_repo.get_payments_by_household(household_id, limit)

    def remove_payment(self, payment_id: str):
        success = self.payment_repo.delete_payment(payment_id)
        if not success:
            raise HTTPException(status_code=404, detail="Payment not found")
        return {"status": "success", "message": "Payment deleted"}