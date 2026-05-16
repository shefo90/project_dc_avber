from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from fastapi import HTTPException
from app.repositories import employee_repo
from app.schemas.employee import EmployeeCreate
from app.models.employee import Employee


def list_all(db: Session) -> list[Employee]:
    return employee_repo.get_all(db)


def search(
    db: Session,
    name: Optional[str],
    code: Optional[str],
    hire_date: Optional[date],
) -> list[Employee]:
    return employee_repo.search(db, name, code, hire_date)


def create(db: Session, data: EmployeeCreate) -> Employee:
    return employee_repo.create(db, data)


def delete(db: Session, emp_id: int) -> Employee:
    emp = employee_repo.delete(db, emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp
