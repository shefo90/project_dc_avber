# Programming Company Management App — Design Spec

**Date:** 2026-05-16
**Type:** Proof of Concept

---

## Problem Definition & Objectives

Build a web-based management application for a programming company prototype. The app must demonstrate Human-Computer Interaction (HCI) principles with a clean, accessible UI and a structured backend API. It covers full CRUD for three core entities — Departments, Employees, and Projects — with search, insert, delete-with-confirmation, and contextual alerts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | FastAPI (Python) |
| ORM | SQLAlchemy 2.x |
| Database | PostgreSQL (Neon cloud) |
| Data validation | Pydantic v2 |
| Frontend framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| HTTP client | fetch (native) |

---

## Database Schema (ERD Summary)

### `departments`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| dept_code | VARCHAR(20) | unique |
| dept_name | VARCHAR(100) | |
| description | TEXT | nullable |
| created_date | DATE | default today |

### `employees`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| emp_code | VARCHAR(20) | unique |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| email | VARCHAR(150) | unique |
| phone | VARCHAR(30) | nullable |
| position | VARCHAR(100) | |
| department_id | INTEGER | FK → departments.id |
| hire_date | DATE | |
| salary | NUMERIC(10,2) | nullable |

### `projects`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| project_code | VARCHAR(20) | unique |
| project_name | VARCHAR(150) | |
| description | TEXT | nullable |
| start_date | DATE | |
| end_date | DATE | nullable |
| status | VARCHAR(30) | active/completed/on-hold |
| budget | NUMERIC(12,2) | nullable |

**Relationships:** Employees belong to one Department (many-to-one).

---

## Backend Architecture

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          # DB URL from env
│   │   └── database.py        # engine, SessionLocal, Base
│   ├── models/
│   │   ├── department.py
│   │   ├── employee.py
│   │   └── project.py
│   ├── schemas/
│   │   ├── department.py      # Pydantic Create/Response schemas
│   │   ├── employee.py
│   │   └── project.py
│   ├── repositories/
│   │   ├── department_repo.py  # DB query logic
│   │   ├── employee_repo.py
│   │   └── project_repo.py
│   ├── services/
│   │   ├── department_service.py
│   │   ├── employee_service.py
│   │   └── project_service.py
│   ├── routes/
│   │   ├── department_routes.py
│   │   ├── employee_routes.py
│   │   └── project_routes.py
│   └── main.py                # app init, CORS, router registration
├── scripts/
│   └── create_tables.py       # Base.metadata.create_all()
└── requirements.txt
```

### API Endpoints (per entity, e.g. employees)

| Method | Path | Description |
|---|---|---|
| GET | `/employees/` | List all |
| GET | `/employees/search` | Search by name, code, hire_date |
| GET | `/employees/{id}` | Get one |
| POST | `/employees/` | Create |
| DELETE | `/employees/{id}` | Delete |

Same pattern for `/departments/` and `/projects/`.

---

## Frontend Architecture

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Sidebar
│   │   ├── page.tsx               # Dashboard: counts per entity
│   │   ├── employees/page.tsx
│   │   ├── departments/page.tsx
│   │   └── projects/page.tsx
│   ├── components/
│   │   ├── Sidebar.tsx            # Navigation
│   │   ├── DataGrid.tsx           # Reusable table with actions
│   │   ├── SearchForm.tsx         # name + code + date filters
│   │   ├── InsertForm.tsx         # Dynamic insert modal per entity
│   │   └── DeleteDialog.tsx       # Confirmation dialog
│   └── lib/
│       └── api.ts                 # Typed fetch helpers → FastAPI
```

### HCI Design Principles Applied
- **Color palette:** Professional blue (#1d4ed8) + neutral grays, white backgrounds
- **Typography:** Inter font, clear size hierarchy (heading/body/caption)
- **Feedback:** Toast notifications for create/delete success and errors
- **Safety:** Confirmation modal before every delete (shows record name)
- **Accessibility:** Labels on all inputs, sufficient color contrast, keyboard-navigable modals
- **Clarity:** Empty states with helpful messages, loading spinners on async actions

---

## Data Flow

1. User fills Search/Insert form in Next.js UI
2. `lib/api.ts` fires typed `fetch` to FastAPI (running on `localhost:8000`)
3. FastAPI route → service → repository → SQLAlchemy query → Neon PostgreSQL
4. Response JSON returned → UI updates data grid or shows toast

---

## Scripts

`scripts/create_tables.py` — run once to create all tables in Neon:
```
python scripts/create_tables.py
```

---

## Team
*(Fill in full names of team members here before final submission)*
