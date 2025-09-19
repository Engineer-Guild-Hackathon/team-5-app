from fastapi import FastAPI, UploadFile, File,HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uvicorn
import httpx
from .api import convert,amivoice,login,signup

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)

app.include_router(convert.router)
app.include_router(amivoice.router)
app.include_router(login.router)
app.include_router(signup.router)

print("OK")