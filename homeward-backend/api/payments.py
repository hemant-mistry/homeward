from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.schemas import PaymentCreateRequest, PaymentResponse
from services.payment_service import PaymentService

# Single router with no global prefix
router = APIRouter(tags=["Payments"])

def get_payment_service():
    return PaymentService()

@router.get("/members/{memberId}/payments", response_model=List[PaymentResponse])
async def get_payments(
    memberId: str, 
    limit: int = 10, 
    service: PaymentService = Depends(get_payment_service)
):
    try:
        return service.fetch_member_payments(memberId, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/members/{memberId}/payments", response_model=PaymentResponse)
async def create_payment(
    memberId: str, 
    payload: PaymentCreateRequest, 
    service: PaymentService = Depends(get_payment_service)
):
    try:
        return service.add_payment(memberId, payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/households/{householdId}/payments", response_model=List[PaymentResponse])
async def get_household_payments(
    householdId: str,
    limit: int = 20,
    service: PaymentService = Depends(get_payment_service)
):
    try:
        return service.fetch_household_payment_history(householdId, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/payments/{paymentId}")
async def delete_payment(
    paymentId: str, 
    service: PaymentService = Depends(get_payment_service)
):
    try:
        return service.remove_payment(paymentId)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))