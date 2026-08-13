from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/workspaces", tags=["Workspaces"])

@router.get("/", response_model=List[schemas.WorkspaceOut])
def list_workspaces(db: Session = Depends(get_db)):
    return crud.get_workspaces(db)

@router.post("/", response_model=schemas.WorkspaceOut)
def create_workspace(workspace: schemas.WorkspaceCreate, db: Session = Depends(get_db)):
    return crud.create_workspace(db=db, workspace=workspace)
