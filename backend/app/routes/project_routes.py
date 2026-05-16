from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.core.database import get_db
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return project_service.list_all(db)


@router.get("/search", response_model=list[ProjectResponse])
def search_projects(
    name: Optional[str] = None,
    code: Optional[str] = None,
    start_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    return project_service.search(db, name, code, start_date)


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    return project_service.create(db, data)


@router.delete("/{project_id}", response_model=ProjectResponse)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    return project_service.delete(db, project_id)
