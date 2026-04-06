import os
from contextlib import asynccontextmanager
from typing import Optional

import httpx
from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from deps import get_current_user_id
from schemas import SalaryCreate, UserCreate, UserLogin, VoteCreate

# Use environment variables from Docker — no need for load_dotenv
IDENTITY_SERVICE_URL = os.getenv("IDENTITY_SERVICE_URL", "http://localhost:8001").rstrip("/")
SALARY_SERVICE_URL = os.getenv("SALARY_SERVICE_URL", "http://localhost:8002").rstrip("/")
VOTE_SERVICE_URL = os.getenv("VOTE_SERVICE_URL", "http://localhost:8003").rstrip("/")
SEARCH_SERVICE_URL = os.getenv("SEARCH_SERVICE_URL", "http://localhost:8004").rstrip("/")
STATS_SERVICE_URL = os.getenv("STATS_SERVICE_URL", "http://localhost:8005").rstrip("/")

@asynccontextmanager
async def lifespan(app: FastAPI):
    timeout = httpx.Timeout(60.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        app.state.http = client
        yield


app = FastAPI(title="BFF Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


def _upstream_response(r: httpx.Response) -> Response:
    return Response(
        content=r.content,
        status_code=r.status_code,
        media_type=r.headers.get("content-type", "application/json"),
    )


@app.post("/api/login")
async def login(body: UserLogin, request: Request):
    r = await request.app.state.http.post(
        f"{IDENTITY_SERVICE_URL}/login",
        json=body.model_dump(mode="json"),
    )
    return _upstream_response(r)


@app.post("/api/signup")
async def signup(body: UserCreate, request: Request):
    r = await request.app.state.http.post(
        f"{IDENTITY_SERVICE_URL}/signup",
        json=body.model_dump(mode="json"),
    )
    return _upstream_response(r)


@app.post("/api/submit")
async def submit(body: SalaryCreate, request: Request):
    r = await request.app.state.http.post(
        f"{SALARY_SERVICE_URL}/submit",
        json=body.model_dump(mode="json"),
    )
    return _upstream_response(r)


@app.post("/api/vote/{submission_id}")
async def vote(
    submission_id: str,
    body: VoteCreate,
    request: Request,
    _: str = Depends(get_current_user_id),
):
    auth = request.headers.get("authorization")
    headers = {"Authorization": auth} if auth else {}
    r = await request.app.state.http.post(
        f"{VOTE_SERVICE_URL}/vote/{submission_id}",
        json=body.model_dump(mode="json"),
        headers=headers,
    )
    return _upstream_response(r)


@app.get("/api/search")
async def search(
    request: Request,
    role: Optional[str] = None,
    company: Optional[str] = None,
    country: Optional[str] = None,
    level: Optional[str] = None,
):
    params = {}
    if role is not None:
        params["role"] = role
    if company is not None:
        params["company"] = company
    if country is not None:
        params["country"] = country
    if level is not None:
        params["level"] = level
    r = await request.app.state.http.get(f"{SEARCH_SERVICE_URL}/search", params=params or None)
    return _upstream_response(r)


@app.get("/api/stats")
async def stats(request: Request):
    q = request.url.query
    url = f"{STATS_SERVICE_URL}/stats"
    if q:
        url = f"{url}?{q}"
    r = await request.app.state.http.get(url)
    return _upstream_response(r)
