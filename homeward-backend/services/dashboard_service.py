from fastapi import HTTPException
from repository.dashboard_repo import DashboardRepository

class DashboardService:
    def __init__(self):
        self.repo = DashboardRepository()
        
    def get_dashboard_metrics(self, household_id: str) -> dict:
        household = self.repo.get_household_details(household_id)
        if not household:
            raise HTTPException(status_code=404, detail="Household not found")
            
        total_loan = household["total_loan_amount"]
        total_paid = self.repo.get_total_payments_for_household(household_id)
        
        # Calculate the percentage safely
        owned_percentage = (total_paid / total_loan * 100) if total_loan > 0 else 0
        
        return {
            "ownedPercentage": round(owned_percentage, 1),
            "totalPaidOff": total_paid,
            "timeSavedMonths": 7 # We can keep this static for now or calculate it later
        }