# Tech Salary Scale

This repository contains the microservices and database infrastructure for the Cloud Computing Applications(CCA) coursework. Follow the below steps to set up your local development environment for coding and testing.

## Local Setup Guide

### Prerequisites
Before starting, ensure you have the following installed on your machine:
* **Docker Desktop**: Ensure the Docker engine is running.
* **Python 3.10+**: Required for running the initialization scripts and microservices.
* **VS Code**: Recommended for a consistent development experience.

---

### Step 1: Environment Configuration
1. In the project root folder, create a new file named `.env`.
2. Copy the contents from `.env.example` into your new `.env` file.
3. Important: Update the DB_PASSWORD and DB_USER to match any values you like; Docker will use them to initialize your container.

    **Default `.env` values:**
    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=admin
    DB_PASSWORD=adminpassword
    DB_NAME=tech_pay_scale_db
    ```



### Step 2: Spin up the Local Database
We use Docker Compose to run a PostgreSQL 15 instance. This setup exactly mirrors the architecture used in our Azure AKS cluster.

Run this command in the root folder:
```
docker compose up -d
```
Verify the container is running by running the following command in your terminal.
```
docker ps
```

### Step 3: Initialize Database Schemas
Once the Docker container is "Started," you must run the initialization script. This creates the three required schemas: `identity`, `salary`, and `community`.

1. Install Dependencies:
    ```
    pip install psycopg2-binary python-dotenv sqlalchemy pydantic-settings
    ```

2. Run the Initializer:
    ```
    python backend/database/db_init.py
    ```

### Project Structure

`/frontend`: For frontend implementations

`/backend`: Contains dedicated folders for all FastAPI microservices (BFF, Identity, Salary, Search, Stats and Vote.).

`/backend/database`: Contains shared logic including `db_connection.py` and `models.py`. Use these for all DB interactions to ensure consistency.

`/k8s`: Kubernetes manifests for Azure deployment.


### Working with the Database in Python
To interact with the database in your service, import the `get_db` dependency and the relevant models. This connection works both locally and in the Azure cluster without code changes.

For example:
```
from database.db_connection import get_db
from database.models import User
from sqlalchemy.orm import Session
from fastapi import Depends

@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()
```