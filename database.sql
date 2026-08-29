-- ============================================================================
-- MediCore Hospital Management System - Schema
-- PostgreSQL 16
--
-- Run with:
--   psql -U postgres -d medicore -f database.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'hospital_admin',
  'department_head',
  'doctor',
  'nurse',
  'pharmacist',
  'lab_technician',
  'receptionist',
  'billing_staff',
  'patient'
);

CREATE TYPE gender AS ENUM (
  'male',
  'female',
  'other'
);

CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE prescription_status AS ENUM (
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE lab_request_status AS ENUM (
  'requested',
  'sample_collected',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE billing_status AS ENUM (
  'draft',
  'issued',
  'partially_paid',
  'paid',
  'voided'
);

CREATE TYPE admission_status AS ENUM (
  'admitted',
  'discharged',
  'transferred'
);

CREATE TYPE room_type AS ENUM (
  'general',
  'private',
  'semi_private',
  'icu',
  'emergency',
  'operating_theatre'
);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================

CREATE TABLE departments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  description   TEXT,
  head_user_id  UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE TRIGGER departments_set_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- USERS
-- Matches the columns queried by repositories/userRepository.js
-- ============================================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  phone_number  TEXT,
  password      TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'patient',
  department_id UUID REFERENCES departments(id),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_users_email        ON users (email);
CREATE INDEX idx_users_role         ON users (role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_department   ON users (department_id);
CREATE INDEX idx_users_created_at   ON users (created_at DESC);

-- Resolve the circular reference between users and departments.
ALTER TABLE departments
  ADD CONSTRAINT fk_departments_head_user
  FOREIGN KEY (head_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- STAFF PROFILES
-- ============================================================================

CREATE TABLE staff_profiles (
  user_id          UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  department_id    UUID REFERENCES departments(id) ON DELETE SET NULL,
  employee_no      TEXT UNIQUE,
  specialization   TEXT,
  license_number   TEXT,
  bio              TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER staff_profiles_set_updated_at
  BEFORE UPDATE ON staff_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- PATIENTS
-- ============================================================================

CREATE TABLE patients (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  first_name             TEXT NOT NULL,
  last_name              TEXT NOT NULL,
  date_of_birth          DATE,
  gender                 gender,
  blood_group            TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  genotype               TEXT,
  address                TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at             TIMESTAMPTZ
);

CREATE TRIGGER patients_set_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_patients_name   ON patients (last_name, first_name);
CREATE INDEX idx_patients_user   ON patients (user_id);

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================

CREATE TABLE appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id     UUID NOT NULL REFERENCES users(id),
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  reason        TEXT,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  status        appointment_status NOT NULL DEFAULT 'scheduled',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER appointments_set_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_appointments_patient ON appointments (patient_id);
CREATE INDEX idx_appointments_doctor  ON appointments (doctor_id);
CREATE INDEX idx_appointments_schedule ON appointments (scheduled_at);

-- ============================================================================
-- MEDICAL RECORDS (encounters / visits)
-- ============================================================================

CREATE TABLE medical_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id       UUID NOT NULL REFERENCES users(id),
  appointment_id  UUID REFERENCES appointments(id) ON DELETE SET NULL,
  symptoms        TEXT,
  diagnosis       TEXT,
  treatment_plan  TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TRIGGER medical_records_set_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_medical_records_patient ON medical_records (patient_id);
CREATE INDEX idx_medical_records_doctor  ON medical_records (doctor_id);

-- ============================================================================
-- DRUGS & INVENTORY
-- ============================================================================

CREATE TABLE drugs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  generic_name  TEXT,
  category      TEXT,
  unit          TEXT,
  reorder_level INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE TRIGGER drugs_set_updated_at
  BEFORE UPDATE ON drugs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_drugs_name ON drugs (name);

CREATE TABLE inventory_transactions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id               UUID NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  type                  TEXT NOT NULL CHECK (type IN ('purchase', 'dispense', 'adjustment', 'expiry')),
  quantity_change       INT NOT NULL,
  unit_cost             NUMERIC(10, 2),
  conducted_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_drug      ON inventory_transactions (drug_id);
CREATE INDEX idx_inventory_created   ON inventory_transactions (created_at DESC);

-- ============================================================================
-- PRESCRIPTIONS
-- ============================================================================

CREATE TABLE prescriptions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id  UUID REFERENCES medical_records(id) ON DELETE CASCADE,
  patient_id         UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id          UUID NOT NULL REFERENCES users(id),
  status             prescription_status NOT NULL DEFAULT 'active',
  instructions       TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER prescriptions_set_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_prescriptions_patient ON prescriptions (patient_id);

CREATE TABLE prescription_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id   UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  drug_id           UUID NOT NULL REFERENCES drugs(id),
  dosage            TEXT,
  quantity          INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  duration_days     INT,
  price_at_issue    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prescription_items_prescription ON prescription_items (prescription_id);
CREATE INDEX idx_prescription_items_drug         ON prescription_items (drug_id);

-- ============================================================================
-- LABORATORY
-- ============================================================================

CREATE TABLE lab_requests (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  requested_by_user_id  UUID NOT NULL REFERENCES users(id),
  performed_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  test_name             TEXT NOT NULL,
  status                lab_request_status NOT NULL DEFAULT 'requested',
  priority              TEXT CHECK (priority IN ('routine', 'urgent', 'stat')),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER lab_requests_set_updated_at
  BEFORE UPDATE ON lab_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_lab_requests_patient ON lab_requests (patient_id);
CREATE INDEX idx_lab_requests_status  ON lab_requests (status);

CREATE TABLE lab_results (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_request_id      UUID NOT NULL UNIQUE REFERENCES lab_requests(id) ON DELETE CASCADE,
  result_data         JSONB,
  summary             TEXT,
  reported_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROOMS & ADMISSIONS
-- ============================================================================

CREATE TABLE rooms (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number         TEXT NOT NULL UNIQUE,
  room_type      room_type NOT NULL DEFAULT 'general',
  department_id  UUID REFERENCES departments(id) ON DELETE SET NULL,
  capacity       INT NOT NULL DEFAULT 1 CHECK (capacity > 0),
  daily_rate     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER rooms_set_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE admissions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  room_id               UUID REFERENCES rooms(id) ON DELETE SET NULL,
  admitted_by_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  admitted_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  discharge_at          TIMESTAMPTZ,
  status                admission_status NOT NULL DEFAULT 'admitted',
  reason                TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER admissions_set_updated_at
  BEFORE UPDATE ON admissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_admissions_patient ON admissions (patient_id);
CREATE INDEX idx_admissions_status  ON admissions (status) WHERE status = 'admitted';

-- ============================================================================
-- BILLING
-- ============================================================================

CREATE TABLE invoices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  status            billing_status NOT NULL DEFAULT 'draft',
  subtotal          NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount          NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  tax               NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total             NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  issued_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER invoices_set_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_invoices_patient ON invoices (patient_id);
CREATE INDEX idx_invoices_status  ON invoices (status);

CREATE TABLE invoice_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description  TEXT NOT NULL,
  quantity     NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price   NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  amount       NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (amount >= 0)
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items (invoice_id);

CREATE TABLE payments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id           UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount               NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  method               TEXT NOT NULL CHECK (method IN ('cash', 'card', 'insurance', 'mobile_money', 'bank_transfer')),
  reference            TEXT,
  received_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  paid_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_invoice ON payments (invoice_id);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity      TEXT,
  entity_id   TEXT,
  metadata    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user    ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs (created_at DESC);

COMMIT;