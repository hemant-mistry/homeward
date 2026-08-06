from fastapi import APIRouter, Depends
from models.schemas import DashboardResponse
from services.dashboard_service import DashboardService

router = APIRouter(prefix="/households", tags=["Dashboard"])

def get_dashboard_service():
    return DashboardService()

@router.get("/{householdId}/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    householdId: str,
    service: DashboardService = Depends(get_dashboard_service)
):
    return service.get_dashboard_metrics(householdId)