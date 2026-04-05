import os
from typing import Optional

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.db_connection import get_db
from database.models import SalarySubmission
from stats_service.schemas import Stats

app = FastAPI(title="Stats Service")

@app.get("/stats")
def calculate_stats(
    role: Optional[str] = None,
    company: Optional[str] = None,
    country: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db)
    ):
    query = db.query(SalarySubmission).filter(SalarySubmission.status == "PENDING")
    query = apply_filters(query, role, company, country, level)
    # Define percentiles to calculate
    percentiles = [0.25, 0.5, 0.75]
    percentile_labels = ["p25_salary", "median_salary", "p75_salary"]
    
    stats_query = [
        func.count(SalarySubmission.id).label("count"),
        func.avg(SalarySubmission.amount).label("avg_salary"),
        func.min(SalarySubmission.amount).label("min_salary"),
        func.max(SalarySubmission.amount).label("max_salary"),
    ]

    stats_query += [
        func.percentile_cont(p).within_group(SalarySubmission.amount.asc()).label(label)
        for p, label in zip(percentiles, percentile_labels)
    ]

    stats = query.with_entities(*stats_query).one()
    return { "stats": Stats(
        count = stats.count,
        avg_salary = float(stats.avg_salary or 0),
        min_salary = float(stats.min_salary or 0),
        max_salary = float(stats.max_salary or 0),
        median_salary = float(stats.median_salary or 0),
        p25_salary = float(stats.p25_salary or 0),
        p75_salary = float(stats.p75_salary or 0)
    ),
    "message": "Stats calculated"  
    }

def apply_filters(query, role, company, country, level):
    if role:
        query = query.filter(SalarySubmission.role.ilike(f"%{role}%"))
    if company:
        query = query.filter(SalarySubmission.company.ilike(f"%{company}%"))
    if country:
        query = query.filter(SalarySubmission.country == country)
    if level:
        query = query.filter(SalarySubmission.experience_level == level)
    return query
