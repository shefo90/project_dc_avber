from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate


def get_all(db: Session) -> list[Employee]:
    return db.query(Employee).all()


def get_by_id(db: Session, emp_id: int) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.id == emp_id).first()


def search(
    db: Session,
    name: Optional[str] = None,
    code: Optional[str] = None,
    hire_date: Optional[date] = None,
) -> list[Employee]:
    q = db.query(Employee)
    if name:
        q = q.filter(
            Employee.first_name.ilike(f"%{name}%") | Employee.last_name.ilike(f"%{name}%")
        )
    if code:
        q = q.filter(Employee.emp_code.ilike(f"%{code}%"))
    if hire_date:
        q = q.filter(Employee.hire_date == hire_date)
    return q.all()


def create(db: Session, data: EmployeeCreate) -> Employee:
    emp = Employee(**data.model_dump())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


def delete(db: Session, emp_id: int) -> Optional[Employee]:
    emp = get_by_id(db, emp_id)
    if emp:
        db.delete(emp)
        db.commit()
    return emp
