from fastapi import HTTPException
from repository.dashboard_repo import DashboardRepository

class DashboardService:
    def __init__(self):
        self.repo = DashboardRepository()

    def get_dashboard_metrics(self, household_id: str):
        household = self.repo.get_household_details(household_id)
        
        if not household:
            raise HTTPException(status_code=404, detail="Household not found")
            
        payments = self.repo.get_household_payments(household_id)
        total_paid = sum(p.get("amount", 0) for p in payments)
        
        # Default total loan amount set to 80 Lakhs
        total_loan = household.get("total_loan_amount", 8000000.0)
        
        owned_percentage = min(round((total_paid / total_loan) * 100, 2), 100.0)
        
        # Calculate precise remaining principal
        remaining_principal = max(0.0, total_loan - total_paid)

        return {
            "ownedPercentage": owned_percentage,
            "totalPaidOff": total_paid,
            "remainingPrincipal": remaining_principal
        }