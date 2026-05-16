from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.core.database import get_db
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.services import department_service

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("/", response_model=list[DepartmentResponse])
def list_departments(db: Session = Depends(get_db)):
    return department_service.list_all(db)


@router.get("/search", response_model=list[DepartmentResponse])
def search_departments(
    name: Optional[str] = None,
    code: Optional[str] = None,
    created_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    return department_service.search(db, name, code, created_date)


@router.post("/", response_model=DepartmentResponse, status_code=201)
def create_department(data: DepartmentCreate, db: Session = Depends(get_db)):
    return department_service.create(db, data)


@router.delete("/{dept_id}", response_model=DepartmentResponse)
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    return department_service.delete(db, dept_id)
