from pydantic import BaseModel
from typing import Optional

class SalaryCreate(BaseModel):
    role: str
    company: str
    country: str
    experience_level: str
    amount: float