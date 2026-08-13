<!-- File: skills/fastapi-patterns.md -->
# FastAPI patterns to use consistently

- APIRouter per resource (forms, questions, public, responses), included in
  main.py with a prefix and tags.
- DB session via a get_db() dependency (yield pattern), injected with Depends()
  — never instantiate a session inside a route body.
- Pydantic schemas are separate from SQLAlchemy models: e.g. QuestionCreate
  (input), QuestionOut (output), Question (ORM model). Never expose the ORM
  model directly as a response_model.
- Enums (question type, form status) defined once in models.py as Python
  Enum + SQLAlchemy Enum column, reused in Pydantic schemas via the same enum
  class — one source of truth, not duplicated string literals.
- Commit/refresh pattern for writes: db.add(obj); db.commit(); db.refresh(obj);
  return obj.