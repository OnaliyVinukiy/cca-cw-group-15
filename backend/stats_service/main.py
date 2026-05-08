import os
from typing import Optional

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.db_connection import get_db
from database.models import SalarySubmission
from stats_service.schemas import Stats

app = FastAPI(title="Stats Service")
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def apply_filters(query, role, company, country, level):
    """Helper to apply optional filters to the query."""
    if role:
        query = query.filter(SalarySubmission.role.ilike(f"%{role}%"))
    if company:
        query = query.filter(SalarySubmission.company.ilike(f"%{company}%"))
    if country:
        query = query.filter(SalarySubmission.country == country)
    if level:
        query = query.filter(SalarySubmission.experience_level == level)
    return query

@app.get("/stats")
def calculate_stats(
    role: Optional[str] = None,
    company: Optional[str] = None,
    country: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SalarySubmission).filter(
        SalarySubmission.status == "APPROVED"
    )

    # Apply optional filters (role, company, etc.)
    query = apply_filters(query, role, company, country, level)

    # Check if records exist to avoid empty aggregate errors
    count_check = query.count()
    if count_check == 0:
        return {
            "stats": Stats(
                count=0,
                avg_salary=0.0,
                min_salary=0.0,
                max_salary=0.0,
                median_salary=0.0,
                p25_salary=0.0,
                p75_salary=0.0,
            ),
            "message": "No approved data found for the given criteria."
        }

    # Perform the calculation
    stats_result = query.with_entities(
        func.count(SalarySubmission.id).label("count"),
        func.avg(SalarySubmission.amount).label("avg_salary"),
        func.min(SalarySubmission.amount).label("min_salary"),
        func.max(SalarySubmission.amount).label("max_salary"),
        
        func.percentile_cont(0.25)
        .within_group(SalarySubmission.amount.asc())
        .label("p25_salary"),

        func.percentile_cont(0.5)
        .within_group(SalarySubmission.amount.asc())
        .label("median_salary"),

        func.percentile_cont(0.75)
        .within_group(SalarySubmission.amount.asc())
        .label("p75_salary"),
    ).first()

    # Build and return the response
    return {
        "stats": Stats(
            count=int(stats_result.count),
            avg_salary=float(stats_result.avg_salary or 0),
            min_salary=float(stats_result.min_salary or 0),
            max_salary=float(stats_result.max_salary or 0),
            median_salary=float(stats_result.median_salary or 0),
            p25_salary=float(stats_result.p25_salary or 0),
            p75_salary=float(stats_result.p75_salary or 0),
        ),
        "message": "Stats calculated successfully - v2"
    }