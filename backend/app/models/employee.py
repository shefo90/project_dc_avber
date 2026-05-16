from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    emp_code = Column(String(20), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(30), nullable=True)
    position = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    hire_date = Column(Date, nullable=False)
    salary = Column(Numeric(10, 2), nullable=True)

    department = relationship("Department", back_populates="employees")
