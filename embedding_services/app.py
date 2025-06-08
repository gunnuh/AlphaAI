from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import requests

app = FastAPI()

class Task(BaseModel):
    id: int
    title: str
    description: str
    status: str
    embedding: List[float] = []

tasks = []

@app.get("/")
async def root():
    return {"message": "Task Manager with Embedding Service is running."}

@app.post("/tasks/")
async def add_task(task: Task):
    # Call the Flask embedding microservice
    response = requests.post("http://127.0.0.1:5050/embed", json={"texts": [task.description]})
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get embedding from embedding service")
    embedding = response.json()['embeddings'][0]
    task.embedding = embedding

    if any(t.id == task.id for t in tasks):
        raise HTTPException(status_code=400, detail="Task ID already exists")

    tasks.append(task)
    return task

@app.get("/tasks/")
async def get_tasks():
    return tasks
