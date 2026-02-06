## HRMS Lite – Backend (FastAPI + MySQL)

Backend API for the HRMS Lite assignment. It provides REST endpoints for managing employees and tracking daily attendance.

---

### 1. Tech Stack

- **Python 3.8+**
- **FastAPI**
- **SQLAlchemy**
- **MySQL** (via `PyMySQL`)
- **Pydantic** (validation)

---

### 2. Project Structure

```text
hrms-lite-backend/
  app/
    main.py           # FastAPI app entrypoint
    database.py       # SQLAlchemy engine & SessionLocal

    models/           # SQLAlchemy ORM models
      employee.py     # Employee table
      attendance.py   # Attendance table

    schemas/          # Pydantic schemas
      employee.py     # EmployeeCreate, EmployeeResponse
      attendance.py   # AttendanceCreate

    routes/           # API routes
      employee.py     # /employees endpoints
      attendance.py   # /attendance endpoints

    utils/
      validators.py   # Custom validators (attendance status)

  requirements.txt    # Backend dependencies
  README.md           # This file
```

---

### 3. Local Setup (Windows PowerShell)

#### 3.1. Create & configure MySQL database

In MySQL shell (or any client):

```sql
CREATE DATABASE hrms_lite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Make sure you have a MySQL user (e.g. `root`) with access to this DB.

By default, `app/database.py` uses:

```text
mysql+pymysql://root:Tanamay%4012345@localhost/hrms_lite
```

You can override this using the `DATABASE_URL` environment variable.

#### 3.2. Create virtual environment & install dependencies

From `hrms-lite-backend` folder:

```powershell
cd hrms-lite-backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### 3.3. (Optional) Override DB URL

If you use a different user/password/host or in deployment:

```powershell
$env:DATABASE_URL = "mysql+pymysql://USER:PASSWORD@HOST/hrms_lite"
```

---

### 4. Run the Backend Server

With the virtual environment activated:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Base URL: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`

---

### 5. API Overview

#### 5.1. Employees

- `POST /employees/`
  - Create a new employee
  - Body: `{ employee_id, full_name, email, department }`
  - Validates:
    - Required fields
    - Valid email
    - Unique `employee_id` and `email`

- `GET /employees/`
  - Returns list of all employees

- `DELETE /employees/{id}`
  - Deletes employee by internal ID
  - Fails with `400` if employee has attendance records

#### 5.2. Attendance

- `POST /attendance/`
  - Mark attendance for an employee
  - Body: `{ employee_id, date, status }`
  - `status` is validated to be `"Present"` or `"Absent"`
  - Prevents duplicate attendance for same employee + date

- `GET /attendance/{employee_id}`
  - Returns all attendance records for that employee

---

### 6. Assumptions & Rules

- Single admin user (no authentication)
- One attendance record per employee per date
- Employees with attendance cannot be deleted
- MySQL used for persistence (can be swapped with other SQL DBs if needed)


