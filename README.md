# MediCore - Enterprise Hospital Management System

A secure, role-based hospital management backend built with Node.js, Express, and PostgreSQL. Features granular RBAC with 9+ user roles (Super Admin, Hospital Admin, Department Head, Doctor, Nurse, Pharmacist, Lab Technician, Receptionist, Billing Staff).

**Key Features:**
- **Granular RBAC**: Role-based permissions with row-level security (RLS)
- **Complete Patient Management**: MRN generation, encounters, visit history
- **Prescription Workflow**: Order → Verify → Dispense with audit trail
- **Smart Scheduling**: Conflict-free appointment booking with doctor availability
- **Billing & Insurance**: Invoice generation, payment tracking, insurance claims
- **Audit Logging**: Complete action history for HIPAA/GDPR compliance
- **Department Analytics**: Real-time dashboards for department heads
- **Real-time Updates**: PostgreSQL LISTEN/NOTIFY for instant notifications
- **Multi-Tenant**: Support for multiple hospitals with data isolation

**Tech Stack:**
- Node.js + Express.js
- PostgreSQL with RLS, JSONB, Full-Text Search
- JWT Authentication + Role-Based Authorization
- pg-boss for job queues (no Redis required)
- In-memory caching for frequently accessed data

**Roles Implemented:**
Super Admin → Hospital Admin → Department Head → Doctor/Nurse/Pharmacist/Lab Tech/Receptionist/Billing Staff
