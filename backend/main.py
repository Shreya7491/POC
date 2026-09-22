import os
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import PyMongoError

# All runtime configuration comes from the environment so the same image
# can be used for local dev and production without code changes.
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "hello-app")
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app = FastAPI(title="Hello App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = mongo_client[MONGO_DB_NAME]
calls_collection = db["api_calls"]


@app.get("/health")
def health():
    """Liveness/readiness probe used by docker-compose healthchecks."""
    try:
        mongo_client.admin.command("ping")
        return {"status": "ok"}
    except PyMongoError:
        return {"status": "degraded"}


@app.get("/hello")
def hello():
    called_at = datetime.now(timezone.utc)

    calls_collection.insert_one({
        "message": "Hello!",
        "called_at": called_at,
    })

    return {
        "message": "Hello!",
        "called_at": called_at,
    }