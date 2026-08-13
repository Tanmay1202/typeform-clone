from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import forms, questions, public, responses
from .database import engine, Base

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Typeform Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # TODO: update with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forms.router)
app.include_router(questions.router)
app.include_router(responses.router)
app.include_router(public.router)
