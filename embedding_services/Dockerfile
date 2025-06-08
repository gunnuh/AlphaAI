FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY embedding_service.py .
EXPOSE 6000
CMD ["python", "embedding_service.py"]
