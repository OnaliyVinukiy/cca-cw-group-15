import os
import bcrypt
from jose import jwt
from datetime import datetime, timedelta


# CONFIG

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# PASSWORD HASHING


def hash_password(password: str) -> str:
    """
    Hash plain password using bcrypt
    """
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify plain password against hashed password
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )



# JWT TOKEN CREATION


def create_access_token(user_id: str) -> str:
    """
    Create JWT token with user_id claim
    (This is what other microservices decode)
    """
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "user_id": user_id,
        "exp": expire
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    # python-jose sometimes returns bytes depending on version
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    return token