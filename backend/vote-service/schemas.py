from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class VoteCreate(BaseModel):
    vote_type: str

class VoteEntry(BaseModel):
    id: Optional[UUID] = None
    vote_type: Optional[str] = None
    user_id: Optional[UUID] = None
    message: Optional[str] = None

class UpdatedSubmission(BaseModel):
    submission_id: UUID
    status: str
    vote: VoteEntry