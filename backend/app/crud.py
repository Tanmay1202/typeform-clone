import uuid
from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

# --- Forms ---

def get_form(db: Session, form_id: int) -> models.Form | None:
    return db.query(models.Form).filter(models.Form.id == form_id).first()

def get_forms(db: Session) -> List[models.Form]:
    return db.query(models.Form).all()

def create_form(db: Session, form: schemas.FormCreate) -> models.Form:
    db_form = models.Form(**form.model_dump())
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form

def update_form(db: Session, db_form: models.Form, form_update: schemas.FormUpdate) -> models.Form:
    update_data = form_update.model_dump(exclude_unset=True)
    
    if update_data.get("status") == models.FormStatus.PUBLISHED and not db_form.share_slug:
        if not update_data.get("share_slug"):
            update_data["share_slug"] = uuid.uuid4().hex[:8]

    for key, value in update_data.items():
        setattr(db_form, key, value)
    
    db.commit()
    db.refresh(db_form)
    return db_form

def delete_form(db: Session, form_id: int) -> None:
    db_form = get_form(db, form_id)
    if db_form:
        db.delete(db_form)
        db.commit()

def get_form_by_slug(db: Session, slug: str) -> models.Form | None:
    return db.query(models.Form).filter(models.Form.share_slug == slug).first()

# --- Questions ---

def get_question(db: Session, question_id: int) -> models.Question | None:
    return db.query(models.Question).filter(models.Question.id == question_id).first()

def create_question(db: Session, form_id: int, question: schemas.QuestionCreate) -> models.Question:
    data = question.model_dump(exclude={"options"})
    db_question = models.Question(**data, form_id=form_id)
    
    if question.options:
        for opt in question.options:
            db_opt = models.QuestionOption(**opt.model_dump())
            db_question.options.append(db_opt)

    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def update_question(db: Session, db_question: models.Question, question_update: schemas.QuestionUpdate) -> models.Question:
    data = question_update.model_dump(exclude_unset=True, exclude={"options"})
    for key, value in data.items():
        setattr(db_question, key, value)

    if question_update.options is not None:
        db.query(models.QuestionOption).filter(models.QuestionOption.question_id == db_question.id).delete()
        for opt in question_update.options:
            db_opt = models.QuestionOption(**opt.model_dump(), question_id=db_question.id)
            db.add(db_opt)

    db.commit()
    db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int) -> None:
    db_question = get_question(db, question_id)
    if db_question:
        db.delete(db_question)
        db.commit()

def reorder_questions(db: Session, form_id: int, question_ids: List[int]) -> List[models.Question]:
    questions = db.query(models.Question).filter(models.Question.form_id == form_id).all()
    q_map = {q.id: q for q in questions}
    
    for idx, q_id in enumerate(question_ids):
        if q_id in q_map:
            q_map[q_id].order_index = idx
            
    db.commit()
    return db.query(models.Question).filter(models.Question.form_id == form_id).order_by(models.Question.order_index).all()

# --- Responses ---

def create_response(db: Session, form_id: int, response: schemas.ResponseCreate) -> models.Response:
    from datetime import datetime
    
    db_response = models.Response(
        form_id=form_id,
        completed=response.completed,
        submitted_at=datetime.utcnow() if response.completed else None
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    
    for ans in response.answers:
        db_answer = models.Answer(
            response_id=db_response.id,
            question_id=ans.question_id,
            value=ans.value
        )
        db.add(db_answer)
        
    db.commit()
    db.refresh(db_response)
    return db_response

def get_responses_for_form(db: Session, form_id: int) -> List[models.Response]:
    return db.query(models.Response).filter(models.Response.form_id == form_id).all()

def get_response(db: Session, form_id: int, response_id: int) -> models.Response | None:
    return db.query(models.Response).filter(models.Response.form_id == form_id, models.Response.id == response_id).first()
