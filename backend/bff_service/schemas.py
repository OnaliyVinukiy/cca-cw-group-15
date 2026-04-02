from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class SalaryCreate(BaseModel):
    role: str
    company: str
    country: str
    experience_level: str
    amount: float


class VoteCreate(BaseModel):
    """vote_type must be UPVOTE or DOWNVOTE (enforced by vote-service)."""

    vote_type: str
