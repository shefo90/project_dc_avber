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
  department_id: number | null;
}

export interface Counts {
  departments: number;
  employees: number;
  projects: number;
}
