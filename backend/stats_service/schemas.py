from pydantic import BaseModel

class Stats(BaseModel):
    count: int
    avg_salary: float
    min_salary: float
    max_salary: float
    median_salary: float
    p25_salary: float
    p75_salary: float