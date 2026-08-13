from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/public", tags=["Public - Respondent Flow"])

@router.get("/f/{share_slug}", response_model=schemas.FormOut)
def get_public_form(share_slug: str, db: Session = Depends(get_db)):
    # TODO: Implement endpoint
    pass

@router.post("/f/{share_slug}/responses", response_model=schemas.ResponseOut)
def submit_response(share_slug: str, response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    # TODO: Implement endpoint
    pass
