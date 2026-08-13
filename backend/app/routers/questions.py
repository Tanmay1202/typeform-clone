from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/forms/{form_id}/questions", tags=["Creator - Questions"])

@router.get("/", response_model=List[schemas.QuestionOut])
def list_questions(form_id: int, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id=form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form.questions

@router.post("/", response_model=schemas.QuestionOut)
def create_question(form_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id=form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.create_question(db=db, form_id=form_id, question=question)

@router.put("/reorder", response_model=List[schemas.QuestionOut])
def reorder_questions(form_id: int, reorder_input: schemas.QuestionReorderInput, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id=form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.reorder_questions(db=db, form_id=form_id, question_ids=reorder_input.question_ids)

@router.put("/{question_id}", response_model=schemas.QuestionOut)
def update_question(form_id: int, question_id: int, question: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    db_question = crud.get_question(db, question_id=question_id)
    if not db_question or db_question.form_id != form_id:
        raise HTTPException(status_code=404, detail="Question not found")
    return crud.update_question(db=db, db_question=db_question, question_update=question)

@router.delete("/{question_id}")
def delete_question(form_id: int, question_id: int, db: Session = Depends(get_db)):
    db_question = crud.get_question(db, question_id=question_id)
    if not db_question or db_question.form_id != form_id:
        raise HTTPException(status_code=404, detail="Question not found")
    crud.delete_question(db=db, question_id=question_id)
    return {"ok": True}
