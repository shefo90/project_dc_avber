from sqlalchemy import Column, Integer, String, Text, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_code = Column(String(20), unique=True, nullable=False)
    project_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(String(30), default="active")
    budget = Column(Numeric(12, 2), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    department = relationship("Department", back_populates="projects")
