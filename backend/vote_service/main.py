import os
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from database.db_connection import get_db
from database.models import Vote, SalarySubmission
from vote_service.schemas import VoteCreate, VoteEntry, UpdatedSubmission
from vote_service.enums import VoteType, SubmissionStatus

app = FastAPI(title="Voting Service")

# Thresholds
UPVOTE_THRESHOLD = 5
DOWNVOTE_THRESHOLD = 10

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"

# Security scheme for Swagger UI
bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/vote/{submission_id}")
def vote(
    submission_id: str, 
    data: VoteCreate, 
    db: Session = Depends(get_db), 
    user_id: str = Depends(get_current_user) 
    ):
    if data.vote_type not in [VoteType.UPVOTE, VoteType.DOWNVOTE]:
        raise HTTPException(status_code=400, detail="Invalid vote type")

    submission = get_submission(db, submission_id)
    existing_vote = get_existing_vote(db, submission_id, user_id)
    vote_entry = process_vote(db, submission_id, user_id, data, existing_vote)

    if isinstance(vote_entry, VoteEntry):
        submission = evaluate_submission_status(db, submission)

    return UpdatedSubmission(
        submission_id = submission.id,
        status = submission.status,
        vote = vote_entry
    )

def get_submission(db: Session, submission_id: str):
    submission = db.query(SalarySubmission).filter(
        SalarySubmission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    return submission

def get_existing_vote(db: Session, submission_id: str, user_id: str):
    return db.query(Vote).filter(
        Vote.submission_id == submission_id,
        Vote.user_id == user_id
    ).first()

def process_vote(db: Session, submission_id: str, user_id: str, data: VoteCreate, existing_vote: Vote):
    if not existing_vote:
        return add_new_vote(db, submission_id, user_id, data.vote_type)
    # Same vote -> ignore
    elif existing_vote.vote_type == data.vote_type:
        return VoteEntry(user_id=user_id, message="Already voted")
    return update_vote(db, existing_vote, data.vote_type)

def add_new_vote(db: Session, submission_id: str, user_id: str, vote_type: str):
    new_vote = Vote(
        submission_id=submission_id,
        user_id=user_id,
        vote_type=vote_type,
    )
    db.add(new_vote)
    db.commit()
    db.refresh(new_vote)
    return VoteEntry(id = new_vote.id, vote_type = new_vote.vote_type, user_id = new_vote.user_id, message = "Added new vote")


def update_vote(db: Session, existing_vote: Vote, vote_type: str):
    existing_vote.vote_type = vote_type
    db.commit()
    db.refresh(existing_vote)
    return VoteEntry(
        id = existing_vote.id, 
        vote_type = existing_vote.vote_type, 
        user_id = existing_vote.user_id, 
        message = "Updated vote" 
        )

def evaluate_submission_status(db: Session, submission: SalarySubmission):
    if submission.status != SubmissionStatus.PENDING:
        return submission
    
    upvotes = db.query(Vote).filter(Vote.submission_id == submission.id, Vote.vote_type == VoteType.UPVOTE).count()
    downvotes = db.query(Vote).filter(Vote.submission_id == submission.id, Vote.vote_type == VoteType.DOWNVOTE).count()

    # Apply thresholds
    if upvotes >= UPVOTE_THRESHOLD and downvotes < DOWNVOTE_THRESHOLD:
        submission.status = SubmissionStatus.APPROVED
        db.commit()
        db.refresh(submission)
    return submission