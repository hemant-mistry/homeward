from fastapi import APIRouter, Depends
from models.schemas import AccessValidationRequest, AccessValidationResponse
from services.access_service import AccessService

router = APIRouter(prefix="/access", tags=["Access"])

def get_access_service():
    return AccessService()

@router.post("/validate", response_model=AccessValidationResponse)
async def validate_key(
    payload: AccessValidationRequest,
    service: AccessService = Depends(get_access_service)
):
    return service.validate_key(payload.accessKey)