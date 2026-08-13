from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/public", tags=["Public - Respondent Flow"])

@router.get("/f/{share_slug}", response_model=schemas.FormOut)
def get_public_form(share_slug: str, db: Session = Depends(get_db)):
    form = crud.get_form_by_slug(db, share_slug)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.status != "PUBLISHED":
        raise HTTPException(status_code=403, detail="Form is not published")
    return form

@router.post("/f/{share_slug}/responses", response_model=schemas.ResponseOut)
def submit_response(share_slug: str, response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    form = crud.get_form_by_slug(db, share_slug)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.status != "PUBLISHED":
        raise HTTPException(status_code=403, detail="Form is not published")
        
    return crud.create_response(db=db, form_id=form.id, response=response)
