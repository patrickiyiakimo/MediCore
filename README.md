# Medicore - Enterprise Hospital Management System

A secure, role-based hospital management application built with **React + Vite** (frontend) and **Node.js + Express** (backend) backed by **PostgreSQL**.

## Architecture

- **`client/`** - React + Vite frontend
  - `src/components/` - dumb/presentational UI components
  - `src/containers/` - smart components (state & logic)
  - `src/shared/` - reusable UI elements (Button, Input, Card, etc.)
  - `src/hooks/`, `src/services/`, `src/contexts/`, `src/utils/`, `src/constants/`
- **`server/`** - Node.js + Express backend (clean architecture)
  - `src/controllers/` - HTTP request/response handling only
  - `src/services/` - all business logic
  - `src/repositories/` - raw SQL / database access only
  - `src/validators/` - Joi request validation schemas
  - `src/middlewares/` - auth, RBAC, rate limiting, error handling
  - `src/routes/`, `src/config/`, `src/utils/`, `src/constants/`

## Getting started

### 1. PostgreSQL

```bash
docker compose up -d db
```

Or use an existing PostgreSQL instance and configure `server/.env`.

### 2. Backend

```bash
cd server
cp .env.example .env  # then fill in real values
npm install
npm run start:dev
```

Runs on `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` to the backend.

## Security

- JWT auth with refresh tokens (HttpOnly cookies)
- Role-based access control (RBAC, 9 roles)
- Joi validation on all inputs
- Parameterized SQL queries (SQL-injection safe)
- Helmet security headers, strict CORS, per-IP rate limiting
- Secrets only in environment variables

## Roles

Super Admin → Hospital Admin → Department Head → Doctor/Nurse/Pharmacist/Lab Tech/Receptionist/Billing Staff