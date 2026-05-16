from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from fastapi import HTTPException
from app.repositories import project_repo
from app.schemas.project import ProjectCreate
from app.models.project import Project


def list_all(db: Session) -> list[Project]:
    return project_repo.get_all(db)


def search(
    db: Session,
    name: Optional[str],
    code: Optional[str],
    start_date: Optional[date],
) -> list[Project]:
    return project_repo.search(db, name, code, start_date)


def create(db: Session, data: ProjectCreate) -> Project:
    return project_repo.create(db, data)


def delete(db: Session, project_id: int) -> Project:
    project = project_repo.delete(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
