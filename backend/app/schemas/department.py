from pydantic import BaseModel
from datetime import date
from typing import Optional


class DepartmentCreate(BaseModel):
    dept_code: str
    dept_name: str
    description: Optional[str] = None
    created_date: Optional[date] = None


class DepartmentResponse(BaseModel):
    id: int
    dept_code: str
    dept_name: str
    description: Optional[str]
    created_date: Optional[date]

    model_config = {"from_attributes": True}
