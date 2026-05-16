from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import Optional, Literal


class ProjectCreate(BaseModel):
    project_code: str
    project_name: str
    description: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    status: Literal["active", "completed", "on-hold"] = "active"
    budget: Optional[Decimal] = None


class ProjectResponse(BaseModel):
    id: int
    project_code: str
    project_name: str
    description: Optional[str]
    start_date: date
    end_date: Optional[date]
    status: str
    budget: Optional[Decimal]

    model_config = {"from_attributes": True}
