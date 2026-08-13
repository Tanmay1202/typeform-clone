from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/forms/{form_id}/responses", tags=["Creator - Responses"])

@router.get("/", response_model=List[schemas.ResponseOut])
def list_responses(form_id: int, db: Session = Depends(get_db)):
    # TODO: Implement endpoint
    pass

@router.get("/{response_id}", response_model=schemas.ResponseOut)
def get_response(form_id: int, response_id: int, db: Session = Depends(get_db)):
    # TODO: Implement endpoint
    pass
