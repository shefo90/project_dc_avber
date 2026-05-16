from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.orm import relationship
from datetime import date as date_type
from app.core.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    dept_code = Column(String(20), unique=True, nullable=False)
    dept_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_date = Column(Date, default=date_type.today)

    employees = relationship("Employee", back_populates="department")
    projects = relationship("Project", back_populates="department")
