from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.core.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.services import employee_service

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    return employee_service.list_all(db)


@router.get("/search", response_model=list[EmployeeResponse])
def search_employees(
    name: Optional[str] = None,
    code: Optional[str] = None,
    hire_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    return employee_service.search(db, name, code, hire_date)


@router.post("/", response_model=EmployeeResponse, status_code=201)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    return employee_service.create(db, data)


@router.delete("/{emp_id}", response_model=EmployeeResponse)
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    return employee_service.delete(db, emp_id)
