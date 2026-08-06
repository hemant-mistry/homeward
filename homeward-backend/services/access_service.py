from fastapi import HTTPException
from repository.access_repo import AccessRepository

class AccessService:
    def __init__(self):
        self.repo = AccessRepository()

    def validate_key(self, access_key: str) -> dict:
        data = self.repo.get_member_by_access_key(access_key)
        
        if not data:
            raise HTTPException(status_code=401, detail="Invalid access key")
        
        # Flatten the joined household data so it matches our Pydantic schema perfectly
        return {
            "id": data["id"],
            "name": data["name"],
            "role": data["role"],
            "household_id": data["household_id"],
            "householdName": data["households"]["name"]
        }