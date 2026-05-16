from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.models.department import Department
from app.schemas.department import DepartmentCreate


def get_all(db: Session) -> list[Department]:
    return db.query(Department).all()


def get_by_id(db: Session, dept_id: int) -> Optional[Department]:
    return db.query(Department).filter(Department.id == dept_id).first()


def search(
    db: Session,
    name: Optional[str] = None,
    code: Optional[str] = None,
    created_date: Optional[date] = None,
) -> list[Department]:
    q = db.query(Department)
    if name:
        q = q.filter(Department.dept_name.ilike(f"%{name}%"))
    if code:
        q = q.filter(Department.dept_code.ilike(f"%{code}%"))
    if created_date:
        q = q.filter(Department.created_date == created_date)
    return q.all()


def create(db: Session, data: DepartmentCreate) -> Department:
    dept = Department(**data.model_dump())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept


def delete(db: Session, dept_id: int) -> Optional[Department]:
    dept = get_by_id(db, dept_id)
    if dept:
        db.delete(dept)
        db.commit()
    return dept
