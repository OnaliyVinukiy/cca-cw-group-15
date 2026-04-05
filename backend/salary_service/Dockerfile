FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH=/app

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY salary_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the shared database folder
COPY database/ ./database/

# Copy the salary service
COPY salary_service ./salary_service/

EXPOSE 8000

# Start the service
CMD ["uvicorn", "salary_service.main:app", "--host", "0.0.0.0", "--port", "8000"]