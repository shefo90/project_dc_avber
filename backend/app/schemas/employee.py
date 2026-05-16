from pydantic import BaseModel, EmailStr
from datetime import date
from decimal import Decimal
from typing import Optional


class EmployeeCreate(BaseModel):
    emp_code: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    position: str
    department_id: Optional[int] = None
    hire_date: date
    salary: Optional[Decimal] = None


class EmployeeResponse(BaseModel):
    id: int
    emp_code: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    position: str
    department_id: Optional[int]
    hire_date: date
    salary: Optional[Decimal]

    model_config = {"from_attributes": True}
