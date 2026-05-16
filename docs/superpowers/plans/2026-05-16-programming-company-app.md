# Programming Company App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack web app (FastAPI + Next.js) for managing Departments, Employees, and Projects at a programming company, with full CRUD, search, and HCI-compliant UI.

**Architecture:** FastAPI backend with SQLAlchemy ORM layered into routes → services → repositories → models, backed by a Neon PostgreSQL database. Next.js frontend calls the API and renders search, insert, delete-with-confirmation, and toast alerts.

**Tech Stack:** Python 3.11, FastAPI, SQLAlchemy 2.x, Pydantic v2, psycopg2-binary, Next.js 14, Tailwind CSS, TypeScript.

---

## File Map

### Backend (`backend/`)
| File | Responsibility |
|---|---|
| `app/core/config.py` | Load DATABASE_URL from .env |
| `app/core/database.py` | SQLAlchemy engine, SessionLocal, Base, get_db |
| `app/models/department.py` | Department ORM model |
| `app/models/employee.py` | Employee ORM model |
| `app/models/project.py` | Project ORM model |
| `app/schemas/department.py` | Pydantic Create + Response schemas |
| `app/schemas/employee.py` | Pydantic Create + Response schemas |
| `app/schemas/project.py` | Pydantic Create + Response schemas |
| `app/repositories/department_repo.py` | get_all, search, create, delete queries |
| `app/repositories/employee_repo.py` | get_all, search, create, delete queries |
| `app/repositories/project_repo.py` | get_all, search, create, delete queries |
| `app/services/department_service.py` | Business logic, raises HTTPException |
| `app/services/employee_service.py` | Business logic, raises HTTPException |
| `app/services/project_service.py` | Business logic, raises HTTPException |
| `app/routes/department_routes.py` | FastAPI router for /departments |
| `app/routes/employee_routes.py` | FastAPI router for /employees |
| `app/routes/project_routes.py` | FastAPI router for /projects |
| `app/main.py` | FastAPI app, CORS, router registration, /health/counts |
| `scripts/create_tables.py` | Create all tables in Neon |
| `requirements.txt` | Python dependencies |
| `.env` | DATABASE_URL secret |

### Frontend (`frontend/`)
| File | Responsibility |
|---|---|
| `src/lib/api.ts` | Typed fetch helpers → FastAPI |
| `src/lib/types.ts` | Shared TypeScript interfaces |
| `src/components/Sidebar.tsx` | Navigation sidebar |
| `src/components/Toast.tsx` | Toast notification component |
| `src/components/DataGrid.tsx` | Generic table with Delete button |
| `src/components/SearchForm.tsx` | name + code + date filter form |
| `src/components/DeleteDialog.tsx` | Confirmation modal |
| `src/components/InsertForm.tsx` | Dynamic insert modal per entity |
| `src/app/layout.tsx` | Root layout with Sidebar |
| `src/app/globals.css` | Tailwind directives + custom vars |
| `src/app/page.tsx` | Dashboard with entity counts |
| `src/app/employees/page.tsx` | Employees CRUD page |
| `src/app/departments/page.tsx` | Departments CRUD page |
| `src/app/projects/page.tsx` | Projects CRUD page |

---

## Task 1: Backend Project Setup

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env`
- Create: `backend/app/__init__.py` (empty)
- Create: `backend/app/core/__init__.py` (empty)
- Create: `backend/app/models/__init__.py` (empty)
- Create: `backend/app/schemas/__init__.py` (empty)
- Create: `backend/app/repositories/__init__.py` (empty)
- Create: `backend/app/services/__init__.py` (empty)
- Create: `backend/app/routes/__init__.py` (empty)
- Create: `backend/scripts/__init__.py` (empty)

- [ ] **Step 1: Create directory structure**

```bash
cd "c:\Users\shefo\OneDrive\Desktop\New folder"
mkdir -p backend/app/core backend/app/models backend/app/schemas backend/app/repositories backend/app/services backend/app/routes backend/scripts
touch backend/app/__init__.py backend/app/core/__init__.py backend/app/models/__init__.py
touch backend/app/schemas/__init__.py backend/app/repositories/__init__.py
touch backend/app/services/__init__.py backend/app/routes/__init__.py backend/scripts/__init__.py
```

- [ ] **Step 2: Write requirements.txt**

`backend/requirements.txt`:
```
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
psycopg2-binary==2.9.9
pydantic==2.9.2
pydantic-settings==2.5.2
email-validator==2.2.0
python-dotenv==1.0.1
httpx==0.27.2
pytest==8.3.3
```

- [ ] **Step 3: Write .env**

`backend/.env`:
```
DATABASE_URL=postgresql://neondb_owner:npg_0hyz7XEomsPT@ep-misty-night-al871e74-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

- [ ] **Step 4: Install dependencies**

```bash
cd backend
pip install -r requirements.txt
```

Expected: All packages install without error.

---

## Task 2: Core Database Configuration

**Files:**
- Create: `backend/app/core/config.py`
- Create: `backend/app/core/database.py`

- [ ] **Step 1: Write config.py**

`backend/app/core/config.py`:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str

    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] **Step 2: Write database.py**

`backend/app/core/database.py`:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- [ ] **Step 3: Verify import works**

```bash
cd backend
python -c "from app.core.database import engine; print('DB engine OK:', engine.url)"
```

Expected: prints `DB engine OK: postgresql://...` with no error.

---

## Task 3: SQLAlchemy Models

**Files:**
- Create: `backend/app/models/department.py`
- Create: `backend/app/models/employee.py`
- Create: `backend/app/models/project.py`

- [ ] **Step 1: Write department model**

`backend/app/models/department.py`:
```python
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
```

- [ ] **Step 2: Write employee model**

`backend/app/models/employee.py`:
```python
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
```

- [ ] **Step 3: Write project model**

`backend/app/models/project.py`:
```python
from sqlalchemy import Column, Integer, String, Text, Date, Numeric
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
```

- [ ] **Step 4: Verify imports**

```bash
cd backend
python -c "from app.models.department import Department; from app.models.employee import Employee; from app.models.project import Project; print('Models OK')"
```

Expected: `Models OK`

---

## Task 4: Pydantic Schemas

**Files:**
- Create: `backend/app/schemas/department.py`
- Create: `backend/app/schemas/employee.py`
- Create: `backend/app/schemas/project.py`

- [ ] **Step 1: Write department schemas**

`backend/app/schemas/department.py`:
```python
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
```

- [ ] **Step 2: Write employee schemas**

`backend/app/schemas/employee.py`:
```python
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
```

- [ ] **Step 3: Write project schemas**

`backend/app/schemas/project.py`:
```python
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
```

---

## Task 5: Repositories

**Files:**
- Create: `backend/app/repositories/department_repo.py`
- Create: `backend/app/repositories/employee_repo.py`
- Create: `backend/app/repositories/project_repo.py`

- [ ] **Step 1: Write department repository**

`backend/app/repositories/department_repo.py`:
```python
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.models.department import Department
from app.schemas.department import DepartmentCreate

def get_all(db: Session) -> list[Department]:
    return db.query(Department).all()

def get_by_id(db: Session, dept_id: int) -> Optional[Department]:
    return db.query(Department).filter(Department.id == dept_id).first()

def search(
    db: Session,
    name: Optional[str] = None,
    code: Optional[str] = None,
    created_date: Optional[date] = None,
) -> list[Department]:
    q = db.query(Department)
    if name:
        q = q.filter(Department.dept_name.ilike(f"%{name}%"))
    if code:
        q = q.filter(Department.dept_code.ilike(f"%{code}%"))
    if created_date:
        q = q.filter(Department.created_date == created_date)
    return q.all()

def create(db: Session, data: DepartmentCreate) -> Department:
    dept = Department(**data.model_dump())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept

def delete(db: Session, dept_id: int) -> Optional[Department]:
    dept = get_by_id(db, dept_id)
    if dept:
        db.delete(dept)
        db.commit()
    return dept
```

- [ ] **Step 2: Write employee repository**

`backend/app/repositories/employee_repo.py`:
```python
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
```

- [ ] **Step 3: Write project repository**

`backend/app/repositories/project_repo.py`:
```python
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.models.project import Project
from app.schemas.project import ProjectCreate

def get_all(db: Session) -> list[Project]:
    return db.query(Project).all()

def get_by_id(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()

def search(
    db: Session,
    name: Optional[str] = None,
    code: Optional[str] = None,
    start_date: Optional[date] = None,
) -> list[Project]:
    q = db.query(Project)
    if name:
        q = q.filter(Project.project_name.ilike(f"%{name}%"))
    if code:
        q = q.filter(Project.project_code.ilike(f"%{code}%"))
    if start_date:
        q = q.filter(Project.start_date == start_date)
    return q.all()

def create(db: Session, data: ProjectCreate) -> Project:
    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

def delete(db: Session, project_id: int) -> Optional[Project]:
    project = get_by_id(db, project_id)
    if project:
        db.delete(project)
        db.commit()
    return project
```

---

## Task 6: Services

**Files:**
- Create: `backend/app/services/department_service.py`
- Create: `backend/app/services/employee_service.py`
- Create: `backend/app/services/project_service.py`

- [ ] **Step 1: Write department service**

`backend/app/services/department_service.py`:
```python
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from fastapi import HTTPException
from app.repositories import department_repo
from app.schemas.department import DepartmentCreate
from app.models.department import Department

def list_all(db: Session) -> list[Department]:
    return department_repo.get_all(db)

def search(
    db: Session,
    name: Optional[str],
    code: Optional[str],
    created_date: Optional[date],
) -> list[Department]:
    return department_repo.search(db, name, code, created_date)

def create(db: Session, data: DepartmentCreate) -> Department:
    return department_repo.create(db, data)

def delete(db: Session, dept_id: int) -> Department:
    dept = department_repo.delete(db, dept_id)
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept
```

- [ ] **Step 2: Write employee service**

`backend/app/services/employee_service.py`:
```python
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from fastapi import HTTPException
from app.repositories import employee_repo
from app.schemas.employee import EmployeeCreate
from app.models.employee import Employee

def list_all(db: Session) -> list[Employee]:
    return employee_repo.get_all(db)

def search(
    db: Session,
    name: Optional[str],
    code: Optional[str],
    hire_date: Optional[date],
) -> list[Employee]:
    return employee_repo.search(db, name, code, hire_date)

def create(db: Session, data: EmployeeCreate) -> Employee:
    return employee_repo.create(db, data)

def delete(db: Session, emp_id: int) -> Employee:
    emp = employee_repo.delete(db, emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp
```

- [ ] **Step 3: Write project service**

`backend/app/services/project_service.py`:
```python
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from fastapi import HTTPException
from app.repositories import project_repo
from app.schemas.project import ProjectCreate
from app.models.project import Project

def list_all(db: Session) -> list[Project]:
    return project_repo.get_all(db)

def search(
    db: Session,
    name: Optional[str],
    code: Optional[str],
    start_date: Optional[date],
) -> list[Project]:
    return project_repo.search(db, name, code, start_date)

def create(db: Session, data: ProjectCreate) -> Project:
    return project_repo.create(db, data)

def delete(db: Session, project_id: int) -> Project:
    project = project_repo.delete(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
```

---

## Task 7: Routes

**Files:**
- Create: `backend/app/routes/department_routes.py`
- Create: `backend/app/routes/employee_routes.py`
- Create: `backend/app/routes/project_routes.py`

- [ ] **Step 1: Write department routes**

`backend/app/routes/department_routes.py`:
```python
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
```

- [ ] **Step 2: Write employee routes**

`backend/app/routes/employee_routes.py`:
```python
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
```

- [ ] **Step 3: Write project routes**

`backend/app/routes/project_routes.py`:
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.core.database import get_db
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("/", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return project_service.list_all(db)

@router.get("/search", response_model=list[ProjectResponse])
def search_projects(
    name: Optional[str] = None,
    code: Optional[str] = None,
    start_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    return project_service.search(db, name, code, start_date)

@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    return project_service.create(db, data)

@router.delete("/{project_id}", response_model=ProjectResponse)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    return project_service.delete(db, project_id)
```

---

## Task 8: main.py + create_tables script

**Files:**
- Create: `backend/app/main.py`
- Create: `backend/scripts/create_tables.py`

- [ ] **Step 1: Write main.py**

`backend/app/main.py`:
```python
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
    allow_origins=["http://localhost:3000"],
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
```

- [ ] **Step 2: Write create_tables.py**

`backend/scripts/create_tables.py`:
```python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.core.database import engine, Base
from app.models import department, employee, project  # noqa: F401

def main():
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully.")

if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Run create_tables**

```bash
cd backend
python scripts/create_tables.py
```

Expected: `All tables created successfully.`

- [ ] **Step 4: Start backend server**

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Expected: `Uvicorn running on http://127.0.0.1:8000`
Open `http://localhost:8000/docs` to verify all 12 endpoints appear.

---

## Task 9: Frontend Setup

**Files:**
- Create: `frontend/` (Next.js project)
- Modify: `frontend/tailwind.config.ts`
- Modify: `frontend/src/app/globals.css`
- Create: `frontend/.env.local`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd "c:\Users\shefo\OneDrive\Desktop\New folder"
npx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

When prompted for options, accept defaults.

- [ ] **Step 2: Write .env.local**

`frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- [ ] **Step 3: Update globals.css**

`frontend/src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #1d4ed8;
  --primary-dark: #1e3a8a;
  --danger: #dc2626;
  --success: #16a34a;
  --warning: #d97706;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
}
```

- [ ] **Step 4: Update tailwind.config.ts**

`frontend/tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1d4ed8", dark: "#1e3a8a" },
        danger: "#dc2626",
        success: "#16a34a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Task 10: TypeScript Types + API Client

**Files:**
- Create: `frontend/src/lib/types.ts`
- Create: `frontend/src/lib/api.ts`

- [ ] **Step 1: Write types.ts**

`frontend/src/lib/types.ts`:
```ts
export interface Department {
  id: number;
  dept_code: string;
  dept_name: string;
  description: string | null;
  created_date: string | null;
}

export interface Employee {
  id: number;
  emp_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  position: string;
  department_id: number | null;
  hire_date: string;
  salary: string | null;
}

export interface Project {
  id: number;
  project_code: string;
  project_name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: "active" | "completed" | "on-hold";
  budget: string | null;
}

export interface Counts {
  departments: number;
  employees: number;
  projects: number;
}

export interface SearchParams {
  name?: string;
  code?: string;
  date?: string;
}
```

- [ ] **Step 2: Write api.ts**

`frontend/src/lib/api.ts`:
```ts
import { Department, Employee, Project, Counts } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

function buildQuery(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v);
  }
  return q.toString();
}

// Departments
export const api = {
  departments: {
    list: () => req<Department[]>("/departments/"),
    search: (name?: string, code?: string, date?: string) =>
      req<Department[]>(`/departments/search?${buildQuery({ name, code, created_date: date })}`),
    create: (data: Omit<Department, "id">) =>
      req<Department>("/departments/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<Department>(`/departments/${id}`, { method: "DELETE" }),
  },
  employees: {
    list: () => req<Employee[]>("/employees/"),
    search: (name?: string, code?: string, date?: string) =>
      req<Employee[]>(`/employees/search?${buildQuery({ name, code, hire_date: date })}`),
    create: (data: Omit<Employee, "id">) =>
      req<Employee>("/employees/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<Employee>(`/employees/${id}`, { method: "DELETE" }),
  },
  projects: {
    list: () => req<Project[]>("/projects/"),
    search: (name?: string, code?: string, date?: string) =>
      req<Project[]>(`/projects/search?${buildQuery({ name, code, start_date: date })}`),
    create: (data: Omit<Project, "id">) =>
      req<Project>("/projects/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<Project>(`/projects/${id}`, { method: "DELETE" }),
  },
  counts: () => req<Counts>("/health/counts"),
};
```

---

## Task 11: Shared UI Components

**Files:**
- Create: `frontend/src/components/Toast.tsx`
- Create: `frontend/src/components/DeleteDialog.tsx`
- Create: `frontend/src/components/DataGrid.tsx`
- Create: `frontend/src/components/SearchForm.tsx`
- Create: `frontend/src/components/InsertForm.tsx`
- Create: `frontend/src/components/Sidebar.tsx`

- [ ] **Step 1: Write Toast.tsx**

`frontend/src/components/Toast.tsx`:
```tsx
"use client";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const colors: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500",
};

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white ${colors[type]} animate-fade-in`}
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">✕</button>
    </div>
  );
}
```

- [ ] **Step 2: Write DeleteDialog.tsx**

`frontend/src/components/DeleteDialog.tsx`:
```tsx
"use client";

interface DeleteDialogProps {
  recordName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDialog({ recordName, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">{recordName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write DataGrid.tsx**

`frontend/src/components/DataGrid.tsx`:
```tsx
"use client";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface DataGridProps<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  onDelete: (row: T) => void;
}

export default function DataGrid<T extends { id: number }>({
  columns,
  rows,
  onDelete,
}: DataGridProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-2">📭</p>
        <p className="text-sm">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-blue-700 text-white">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-semibold tracking-wide">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left font-semibold tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-t border-gray-100 hover:bg-blue-50 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                  {String(row[col.key] ?? "—")}
                </td>
              ))}
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(row)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Write SearchForm.tsx**

`frontend/src/components/SearchForm.tsx`:
```tsx
"use client";
import { useState } from "react";

interface SearchFormProps {
  onSearch: (name: string, code: string, date: string) => void;
  onReset: () => void;
  datePlaceholder?: string;
}

export default function SearchForm({ onSearch, onReset, datePlaceholder = "Date" }: SearchFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(name, code, date);
  };

  const handleReset = () => {
    setName(""); setCode(""); setDate("");
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search by name..."
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Search by code..."
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{datePlaceholder}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
      >
        Search
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Reset
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Write InsertForm.tsx**

`frontend/src/components/InsertForm.tsx`:
```tsx
"use client";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "date" | "number" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface InsertFormProps {
  title: string;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, string>) => void;
  onClose: () => void;
}

export default function InsertForm({ title, fields, onSubmit, onClose }: InsertFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      const el = form.elements.namedItem(f.name) as HTMLInputElement | HTMLSelectElement;
      data[f.name] = el?.value ?? "";
    });
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">➕ {title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Insert Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Write Sidebar.tsx**

`frontend/src/components/Sidebar.tsx`:
```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/employees", label: "Employees", icon: "👥" },
  { href: "/departments", label: "Departments", icon: "🏢" },
  { href: "/projects", label: "Projects", icon: "📁" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 min-h-screen bg-blue-900 text-white flex flex-col shadow-xl">
      <div className="px-6 py-6 border-b border-blue-800">
        <h1 className="text-lg font-bold tracking-tight">💻 DevCo Manager</h1>
        <p className="text-xs text-blue-300 mt-1">Programming Company System</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-blue-800 text-xs text-blue-400">
        © 2026 DevCo — POC v1.0
      </div>
    </aside>
  );
}
```

---

## Task 12: Layout + Dashboard Page

**Files:**
- Modify: `frontend/src/app/layout.tsx`
- Create: `frontend/src/app/page.tsx`

- [ ] **Step 1: Write layout.tsx**

`frontend/src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DevCo Manager",
  description: "Programming Company Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write dashboard page.tsx**

`frontend/src/app/page.tsx`:
```tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Counts } from "@/lib/types";

const cards = [
  { key: "departments" as const, label: "Departments", icon: "🏢", color: "bg-indigo-500" },
  { key: "employees" as const, label: "Employees", icon: "👥", color: "bg-blue-500" },
  { key: "projects" as const, label: "Projects", icon: "📁", color: "bg-cyan-500" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.counts().then(setCounts).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to DevCo Manager — your company at a glance</p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
              <div className={`${c.color} rounded-xl w-14 h-14 flex items-center justify-center text-2xl text-white shadow`}>
                {c.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{counts?.[c.key] ?? 0}</p>
                <p className="text-sm text-gray-500">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Quick Navigation</h2>
        <p className="text-sm text-gray-500">Use the sidebar to manage Employees, Departments, and Projects. Each section supports search, insert, and delete operations.</p>
      </div>
    </div>
  );
}
```

---

## Task 13: Entity Pages

**Files:**
- Create: `frontend/src/app/departments/page.tsx`
- Create: `frontend/src/app/employees/page.tsx`
- Create: `frontend/src/app/projects/page.tsx`

- [ ] **Step 1: Write departments/page.tsx**

`frontend/src/app/departments/page.tsx`:
```tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Department } from "@/lib/types";
import DataGrid from "@/components/DataGrid";
import SearchForm from "@/components/SearchForm";
import InsertForm, { FieldConfig } from "@/components/InsertForm";
import DeleteDialog from "@/components/DeleteDialog";
import Toast, { ToastType } from "@/components/Toast";

const columns = [
  { key: "id" as const, label: "ID" },
  { key: "dept_code" as const, label: "Code" },
  { key: "dept_name" as const, label: "Name" },
  { key: "description" as const, label: "Description" },
  { key: "created_date" as const, label: "Created Date" },
];

const fields: FieldConfig[] = [
  { name: "dept_code", label: "Department Code", type: "text", required: true },
  { name: "dept_name", label: "Department Name", type: "text", required: true },
  { name: "description", label: "Description", type: "text" },
  { name: "created_date", label: "Created Date", type: "date" },
];

export default function DepartmentsPage() {
  const [rows, setRows] = useState<Department[]>([]);
  const [showInsert, setShowInsert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = useCallback(() => api.departments.list().then(setRows), []);
  useEffect(() => { load(); }, [load]);

  const notify = (message: string, type: ToastType) => setToast({ message, type });

  const handleSearch = (name: string, code: string, date: string) => {
    api.departments.search(name, code, date).then(setRows).catch(() => notify("Search failed", "error"));
  };

  const handleInsert = (data: Record<string, string>) => {
    api.departments.create(data as any)
      .then(() => { load(); setShowInsert(false); notify("Department added successfully", "success"); })
      .catch((e) => notify(e.message, "error"));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    api.departments.delete(deleteTarget.id)
      .then(() => { load(); setDeleteTarget(null); notify("Department deleted", "success"); })
      .catch((e) => notify(e.message, "error"));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏢 Departments</h1>
          <p className="text-gray-500 mt-1">{rows.length} record(s)</p>
        </div>
        <button
          onClick={() => setShowInsert(true)}
          className="px-5 py-2 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors shadow"
        >
          + New Department
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <SearchForm onSearch={handleSearch} onReset={load} datePlaceholder="Created Date" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <DataGrid columns={columns} rows={rows} onDelete={setDeleteTarget} />
      </div>

      {showInsert && <InsertForm title="Add Department" fields={fields} onSubmit={handleInsert} onClose={() => setShowInsert(false)} />}
      {deleteTarget && <DeleteDialog recordName={deleteTarget.dept_name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
```

- [ ] **Step 2: Write employees/page.tsx**

`frontend/src/app/employees/page.tsx`:
```tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Employee } from "@/lib/types";
import DataGrid from "@/components/DataGrid";
import SearchForm from "@/components/SearchForm";
import InsertForm, { FieldConfig } from "@/components/InsertForm";
import DeleteDialog from "@/components/DeleteDialog";
import Toast, { ToastType } from "@/components/Toast";

const columns = [
  { key: "id" as const, label: "ID" },
  { key: "emp_code" as const, label: "Code" },
  { key: "first_name" as const, label: "First Name" },
  { key: "last_name" as const, label: "Last Name" },
  { key: "email" as const, label: "Email" },
  { key: "position" as const, label: "Position" },
  { key: "hire_date" as const, label: "Hire Date" },
];

const fields: FieldConfig[] = [
  { name: "emp_code", label: "Employee Code", type: "text", required: true },
  { name: "first_name", label: "First Name", type: "text", required: true },
  { name: "last_name", label: "Last Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "position", label: "Position", type: "text", required: true },
  { name: "hire_date", label: "Hire Date", type: "date", required: true },
  { name: "salary", label: "Salary", type: "number" },
];

export default function EmployeesPage() {
  const [rows, setRows] = useState<Employee[]>([]);
  const [showInsert, setShowInsert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = useCallback(() => api.employees.list().then(setRows), []);
  useEffect(() => { load(); }, [load]);

  const notify = (message: string, type: ToastType) => setToast({ message, type });

  const handleSearch = (name: string, code: string, date: string) => {
    api.employees.search(name, code, date).then(setRows).catch(() => notify("Search failed", "error"));
  };

  const handleInsert = (data: Record<string, string>) => {
    api.employees.create(data as any)
      .then(() => { load(); setShowInsert(false); notify("Employee added successfully", "success"); })
      .catch((e) => notify(e.message, "error"));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    api.employees.delete(deleteTarget.id)
      .then(() => { load(); setDeleteTarget(null); notify("Employee deleted", "success"); })
      .catch((e) => notify(e.message, "error"));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👥 Employees</h1>
          <p className="text-gray-500 mt-1">{rows.length} record(s)</p>
        </div>
        <button
          onClick={() => setShowInsert(true)}
          className="px-5 py-2 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors shadow"
        >
          + New Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <SearchForm onSearch={handleSearch} onReset={load} datePlaceholder="Hire Date" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <DataGrid columns={columns} rows={rows} onDelete={setDeleteTarget} />
      </div>

      {showInsert && <InsertForm title="Add Employee" fields={fields} onSubmit={handleInsert} onClose={() => setShowInsert(false)} />}
      {deleteTarget && <DeleteDialog recordName={`${deleteTarget.first_name} ${deleteTarget.last_name}`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
```

- [ ] **Step 3: Write projects/page.tsx**

`frontend/src/app/projects/page.tsx`:
```tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Project } from "@/lib/types";
import DataGrid from "@/components/DataGrid";
import SearchForm from "@/components/SearchForm";
import InsertForm, { FieldConfig } from "@/components/InsertForm";
import DeleteDialog from "@/components/DeleteDialog";
import Toast, { ToastType } from "@/components/Toast";

const columns = [
  { key: "id" as const, label: "ID" },
  { key: "project_code" as const, label: "Code" },
  { key: "project_name" as const, label: "Name" },
  { key: "status" as const, label: "Status" },
  { key: "start_date" as const, label: "Start Date" },
  { key: "end_date" as const, label: "End Date" },
];

const fields: FieldConfig[] = [
  { name: "project_code", label: "Project Code", type: "text", required: true },
  { name: "project_name", label: "Project Name", type: "text", required: true },
  { name: "description", label: "Description", type: "text" },
  { name: "start_date", label: "Start Date", type: "date", required: true },
  { name: "end_date", label: "End Date", type: "date" },
  {
    name: "status", label: "Status", type: "select", required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
      { value: "on-hold", label: "On Hold" },
    ],
  },
  { name: "budget", label: "Budget ($)", type: "number" },
];

export default function ProjectsPage() {
  const [rows, setRows] = useState<Project[]>([]);
  const [showInsert, setShowInsert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = useCallback(() => api.projects.list().then(setRows), []);
  useEffect(() => { load(); }, [load]);

  const notify = (message: string, type: ToastType) => setToast({ message, type });

  const handleSearch = (name: string, code: string, date: string) => {
    api.projects.search(name, code, date).then(setRows).catch(() => notify("Search failed", "error"));
  };

  const handleInsert = (data: Record<string, string>) => {
    api.projects.create(data as any)
      .then(() => { load(); setShowInsert(false); notify("Project added successfully", "success"); })
      .catch((e) => notify(e.message, "error"));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    api.projects.delete(deleteTarget.id)
      .then(() => { load(); setDeleteTarget(null); notify("Project deleted", "success"); })
      .catch((e) => notify(e.message, "error"));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📁 Projects</h1>
          <p className="text-gray-500 mt-1">{rows.length} record(s)</p>
        </div>
        <button
          onClick={() => setShowInsert(true)}
          className="px-5 py-2 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors shadow"
        >
          + New Project
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <SearchForm onSearch={handleSearch} onReset={load} datePlaceholder="Start Date" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <DataGrid columns={columns} rows={rows} onDelete={setDeleteTarget} />
      </div>

      {showInsert && <InsertForm title="Add Project" fields={fields} onSubmit={handleInsert} onClose={() => setShowInsert(false)} />}
      {deleteTarget && <DeleteDialog recordName={deleteTarget.project_name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
```

---

## Task 14: Final Verification

- [ ] **Step 1: Start backend**

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

- [ ] **Step 2: Start frontend**

```bash
cd frontend
npm run dev
```

- [ ] **Step 3: Verify golden paths**

1. Open `http://localhost:3000` — dashboard shows 3 stat cards
2. Navigate to Departments → insert a record → toast appears → grid updates
3. Delete a record → confirmation dialog appears → confirm → toast appears
4. Use search form with name/code/date → results filter correctly
5. Repeat for Employees and Projects

---

*Self-review: all spec requirements covered (search by name/code/date ✓, data grid ✓, insert forms per table ✓, delete confirmation ✓, alerts ✓, HCI colors/fonts ✓, secure DB via env var ✓). No placeholders. Types consistent across tasks.*
