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
COPY search_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the shared database folder
COPY database/ ./database/

# Copy the search service
COPY search_service ./search_service/

EXPOSE 8000

# Start the service
CMD ["uvicorn", "search_service.main:app", "--host", "0.0.0.0", "--port", "8000"]