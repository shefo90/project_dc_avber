from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.models.project import Project
from app.schemas.project import ProjectCreate


def get_all(db: Session) -> list[Project]:
    return db.query(Project).all()


def get_by_id(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()


def search(
    db: Session,
    name: Optional[str] = None,
    code: Optional[str] = None,
    start_date: Optional[date] = None,
) -> list[Project]:
    q = db.query(Project)
    if name:
        q = q.filter(Project.project_name.ilike(f"%{name}%"))
    if code:
        q = q.filter(Project.project_code.ilike(f"%{code}%"))
    if start_date:
        q = q.filter(Project.start_date == start_date)
    return q.all()


def create(db: Session, data: ProjectCreate) -> Project:
    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def delete(db: Session, project_id: int) -> Optional[Project]:
    project = get_by_id(db, project_id)
    if project:
        db.delete(project)
        db.commit()
    return project
