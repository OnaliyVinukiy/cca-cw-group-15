from enum import Enum

class VoteType(str, Enum):
    UPVOTE = "UPVOTE"
    DOWNVOTE = "DOWNVOTE"

class SubmissionStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"