from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from fastapi import HTTPException
from app.repositories import department_repo
from app.schemas.department import DepartmentCreate
from app.models.department import Department


def list_all(db: Session) -> list[Department]:
    return department_repo.get_all(db)


def search(
    db: Session,
    name: Optional[str],
    code: Optional[str],
    created_date: Optional[date],
) -> list[Department]:
    return department_repo.search(db, name, code, created_date)


def create(db: Session, data: DepartmentCreate) -> Department:
    return department_repo.create(db, data)


def delete(db: Session, dept_id: int) -> Department:
    dept = department_repo.delete(db, dept_id)
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept
