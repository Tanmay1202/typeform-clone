from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/forms", tags=["Creator - Forms"])

@router.get("/", response_model=List[schemas.FormOut])
def list_forms(db: Session = Depends(get_db)):
    return crud.get_forms(db)

@router.post("/", response_model=schemas.FormOut)
def create_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    return crud.create_form(db=db, form=form)

@router.get("/{form_id}", response_model=schemas.FormOut)
def get_form(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id=form_id)
    if db_form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@router.put("/{form_id}", response_model=schemas.FormOut)
def update_form(form_id: int, form: schemas.FormUpdate, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id=form_id)
    if db_form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.update_form(db=db, db_form=db_form, form_update=form)

@router.delete("/{form_id}")
def delete_form(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id=form_id)
    if db_form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    crud.delete_form(db=db, form_id=form_id)
    return {"ok": True}
