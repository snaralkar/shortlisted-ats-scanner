import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import scans

app = FastAPI(title="Shortlisted API")

frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scans.router)


@app.get("/")
def root():
    return {"service": "Shortlisted API", "status": "ok", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
