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
COPY identity_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the shared database folder
COPY database/ ./database/

# Copy identity service
COPY identity_service/ ./identity_service/

EXPOSE 8000

# Run the app
CMD ["uvicorn", "identity_service.main:app", "--host", "0.0.0.0", "--port", "8000"]