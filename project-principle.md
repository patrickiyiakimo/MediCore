# Medicore - Project Architecture Principles

## 📁 Project Overview

This document defines the architectural principles and folder structure for the Medicore hospital management application. Following these guidelines ensures consistency, maintainability, and scalability across the codebase. 

**Critical Constraints**:
- **Each code file MUST NOT exceed 200 lines of code**
- **All server APIs must be fast and extremely secure**
- **Follow SOLID principles and clean architecture**

**Tech Stack**:
- **Frontend**: React + Vite (JavaScript)
- **Backend**: Node.js + Express.js (JavaScript)
- **Database**: PostgreSQL
- **Package Manager**: npm or yarn

---

## 🏗️ Root Directory Structure
medicore/
├── client/ # React Frontend
│ ├── public/ # Static assets
│ │ └── index.html
│ ├── src/
│ │ ├── components/ # UI components (dumb/presentational)
│ │ ├── containers/ # Logic & state management (smart components)
│ │ ├── shared/ # Reusable UI elements (buttons, checkbox, skeleton etc.)
│ │ ├── hooks/ # Custom React hooks
│ │ ├── services/ # API service layer
│ │ ├── contexts/ # React Context providers
│ │ ├── utils/ # Utility functions
│ │ ├── constants/ # Application constants
│ │ ├── App.jsx # Main app component
│ │ └── main.jsx # Entry point
│ ├── package.json
│ ├── vite.config.js
│ └── .eslintrc.js
│
├── server/ # Node.js Backend
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ ├── controllers/ # Route controllers (request handlers)
│ │ ├── services/ # Business logic layer
│ │ ├── models/ # Database models (if using ORM)
│ │ ├── repositories/ # Data access layer (raw SQL/queries)
│ │ ├── middlewares/ # Express middlewares
│ │ ├── routes/ # API route definitions
│ │ ├── validators/ # Request validation schemas
│ │ ├── utils/ # Utility functions
│ │ ├── constants/ # Application constants
│ │ ├── types/ # JSDoc types (optional)
│ │ └── app.js # Express app setup
│ ├── package.json
│ └── .env.example # Environment variables template
│
├── docker-compose.yml # Docker setup (optional)
├── .gitignore
└── README.md

text

---

## 🛡️ Security Principles (CRITICAL)

### API Security Requirements:
1. **Authentication**: JWT-based with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: All inputs validated using Joi/express-validator
4. **SQL Injection Prevention**: Use parameterized queries or ORM
5. **XSS Protection**: Sanitize all user inputs
6. **Rate Limiting**: Implement per-IP rate limiting (100 requests/minute)
7. **Helmet.js**: Use for secure HTTP headers
8. **Environment Variables**: All secrets in .env, never in code
9. **CORS**: Strictly configure allowed origins
10. **Request Logging**: Log all API requests with timestamps

---

## ⚡ Performance Guidelines

### Time Complexity Requirements:
- **API Response Time**: < 200ms (p95)
- **Database Queries**: Always index foreign keys and frequently queried columns
- **Complexity Targets**:
  - CRUD operations: O(1) or O(log n)
  - Search operations: O(log n) with proper indexing
  - Bulk operations: O(n) maximum
  - Avoid O(n²) or worse in loops
  - Use pagination for all list endpoints (limit/offset)

### Code Optimization Rules:
- Use database indexes for all WHERE, JOIN, and ORDER BY clauses
- Implement caching (Redis) for frequently accessed data
- Lazy load frontend components using React.lazy()
- Use memoization (useMemo, useCallback) where appropriate
- Batch database operations where possible
- Use connection pooling for PostgreSQL

---

## 📝 Naming Conventions

### Backend:
- **Controllers**: `{resource}Controller.js` (e.g., `patientController.js`)
- **Services**: `{resource}Service.js` (e.g., `patientService.js`)
- **Models**: `{Resource}.js` (e.g., `Patient.js`)
- **Repositories**: `{resource}Repository.js` (e.g., `patientRepository.js`)
- **Routes**: `{resource}Routes.js` (e.g., `patientRoutes.js`)
- **Validators**: `{resource}Validator.js` (e.g., `patientValidator.js`)
- **Middleware**: `{purpose}Middleware.js` (e.g., `authMiddleware.js`)

### Frontend:
- **Components**: PascalCase (e.g., `PatientCard.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `usePatientData.js`)
- **Services**: camelCase (e.g., `patientService.js`)
- **Utils**: camelCase (e.g., `dateFormatter.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

---

## 🔄 Data Flow Pattern
Client (React)
↓ (HTTP Request)
Routes → Validators → Middleware → Controllers
↓
Services (Business Logic)
↓
Repositories (Data Access)
↓
Database (PostgreSQL)

text

**Key Principles:**
1. Controllers handle HTTP requests/responses only
2. Services contain ALL business logic
3. Repositories handle ONLY database operations
4. No business logic in controllers or repositories
5. Validators run BEFORE any business logic

---

## 📊 Database Principles

- Use UUIDs for primary keys (not auto-incrementing integers)
- Add timestamps (created_at, updated_at) to all tables
- Use soft deletes (deleted_at column) instead of hard deletes
- Add proper foreign key constraints
- Create indexes for all foreign keys and frequently queried columns
- Use transactions for multi-table operations
- Write raw SQL in repositories, avoid ORM for complex queries

---

## 🧪 Testing Requirements

- Unit tests for utilities and services
- Integration tests for API endpoints
- Use Jest for backend testing
- Use React Testing Library for frontend
- Minimum 80% test coverage
- Test files: `*.test.js` or `*.spec.js`

---

## 📦 Error Handling

### Backend Error Response Format:
```javascript
{
  success: false,
  message: "Human-readable error message",
  code: "ERROR_CODE",
  status: 400,
  details: {} // Optional validation errors
}
HTTP Status Codes:
200: Success

201: Created

400: Validation error

401: Unauthorized

403: Forbidden

404: Not found

429: Too many requests

500: Internal server error

🔄 Version Control
Use Git with conventional commits

Branch naming: feature/description, bugfix/description, hotfix/description

PR reviews required before merging to main

🚀 Deployment Checklist
□ All tests passing
□ Environment variables configured
□ Database migrations run
□ API documentation updated (Swagger/Postman)
□ Performance tested
□ Security audit performed
□ Logging configured
□ Monitoring setup