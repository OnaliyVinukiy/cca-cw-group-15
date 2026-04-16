# Tech Salary Scale

This repository contains the **Kubernetes Manifests (YAML)** and microservices infrastructure for the Tech Salary Scale platform. The system is architected as a cloud-native application deployed on **Azure Kubernetes Service (AKS)**.

## Cloud Architecture Overview
This system emphasizes infrastructure orchestration and security as follows:
* **Logical Isolation**: Separated into `app` (Microservices) and `data` (PostgreSQL) namespaces.
* **External Access**: Managed via an **Azure Load Balancer** and **Nginx Ingress Controller** (Layer 7 routing).
* **Persistence**: Implemented using **Persistent Volume Claims (PVC)** to ensure data durability in the `data` namespace.
* **Secret Management**: Sensitive credentials are externalized using **Kubernetes Secrets** (Base64 encoded) and injected into pods at runtime.

---

## Azure Deployment Guide (Reproducibility)

### 1. Registry Authentication
Login to the Azure Container Registry (ACR) to push your microservice images:
```bash
az login
az acr login --name techsalaryscale
```

### 2. Build and Push Images
Build your images and push them to ACR. Ensure you tag them correctly for the manifests.
```bash
# Example for Salary Service
cd backend/salary_service

docker build -t techsalaryscale.azurecr.io/salary-service:v1 .

docker push techsalaryscale.azurecr.io/salary-service:v1
```
### 3. Deploy Kubernetes Manifests
Apply the cloud configurations in the following order to the AKS cluster:
```bash
# 1. Create Namespaces
kubectl apply -f k8s/namespaces/

# 2. Deploy Storage & Database (Data Namespace)
kubectl apply -f k8s/db/ -n data

# 3. Apply Configuration & Secrets (App Namespace)
kubectl apply -f k8s/config/app-secrets.yaml -n app

# 4. Apply Configuration & Secrets (Data Namespace)
kubectl apply -f k8s/config/db-secrets.yaml -n app

# 4. Deploy Microservices & Ingress (App Namespace)
kubectl apply -f k8s/app/ -n app
```

## Local Development Guide

### 1. Environment Configuration
Create a `.env` file in the root folder based on `.env.example`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=adminpassword
DB_NAME=tech_pay_scale_db
```

### 2. Local Database (Docker Compose)
Spins up a local PostgreSQL instance mirroring the Azure production environment:
```bash
docker compose up -d
```
### 3. Schema Initialization
Initializes the three logical schemas: `identity`, `salary`, and `community`.
```bash
pip install psycopg2-binary python-dotenv sqlalchemy pydantic-settings

python backend/database/db_init.py
```

## Repository Structure (Infrastructure Focused)
- `/k8s`: Core Infrastructure Folder
    - `/app`: Deployment and Service manifests for all 7 microservices.
    - `/db`: PostgreSQL Deployment, Service, and PersistentVolumeClaim.
    - `/config`: Kubernetes Secrets and ConfigMaps.
    - `/namespaces`: Definitions for `app` and `data`.
    - `ingress.yaml`: Ingress rules for path-based routing (`/` vs `/api`).

- `/backend`: Source code for FastAPI microservices (BFF, Identity, Salary, Search, Stats, Vote).

- `/frontend`: React.js source code (Multi-stage Docker builds).

## Security & Self-Healing
- Probes: Every deployment includes Liveness and Readiness probes to ensure the cluster automatically restarts unhealthy containers.

- Isolation: Internal services are exposed via ClusterIP and are not accessible from the public internet; they sit behind the BFF "gatekeeper."

- Statelessness: All application pods are stateless; all state is managed via the persistent database layer in the data namespace.