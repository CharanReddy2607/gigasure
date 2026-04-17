# Use slim python for small image size (faster cold starts)
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY fraud_service.py .

# Handle the joblib file (it will be trained inside the container if not found)
# No need to copy it, let the service self-train on first run for simplicity

ENV PORT=5000
EXPOSE 5000

CMD ["python", "fraud_service.py"]
