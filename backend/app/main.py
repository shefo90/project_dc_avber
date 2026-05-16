from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routes import department_routes, employee_routes, project_routes
from app.models.department import Department
from app.models.employee import Employee
from app.models.project import Project

app = FastAPI(title="Programming Company API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(department_routes.router)
app.include_router(employee_routes.router)
app.include_router(project_routes.router)


@app.get("/")
def root():
    return {"message": "Programming Company API is running"}


@app.get("/health/counts")
def get_counts(db: Session = Depends(get_db)):
    return {
        "departments": db.query(Department).count(),
        "employees": db.query(Employee).count(),
        "projects": db.query(Project).count(),
    }
