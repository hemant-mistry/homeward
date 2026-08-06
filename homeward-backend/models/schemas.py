# app/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Add these below your Payment models in models/schemas.py ---

class AccessValidationRequest(BaseModel):
    accessKey: str

class AccessValidationResponse(BaseModel):
    memberId: str = Field(validation_alias="id")
    memberName: str = Field(validation_alias="name")
    role: str
    householdId: str = Field(validation_alias="household_id")
    householdName: str # We will map this manually in the service

class DashboardResponse(BaseModel):
    ownedPercentage: float
    totalPaidOff: float
    timeSavedMonths: int

# --- Payments ---
class PaymentCreateRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Contribution amount must be greater than zero")
    paidOn: Optional[str] = None  # Accepts the ISO date string from the modal
    method: Optional[str] = "cash"

class PaymentResponse(BaseModel):
    id: str
    # Tell Pydantic to look for 'member_id' in the DB dictionary, but call it 'memberId' in Python/JSON
    memberId: str = Field(validation_alias="member_id")
    memberName: str = Field(validation_alias="member_name")
    amount: float
    timestamp: datetime
    isMilestone: bool = Field(default=False, validation_alias="is_milestone")

# --- Milestones ---
class MilestoneResponse(BaseModel):
    id: str
    title: str
    targetPercentage: float
    isUnlocked: bool
    unlockedAt: Optional[datetime] = None