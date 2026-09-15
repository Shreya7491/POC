from datetime import datetime, timezone
 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
 
app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://<EC2_PUBLIC_IP>:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
mongo_client = MongoClient("mongodb://mongodb:27017")
 
db = mongo_client["hello-app"]
calls_collection = db["api_calls"]
 
 
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