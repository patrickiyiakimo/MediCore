const pool = require("./src/config/db");
const bcrypt = require("bcryptjs");
const ROLES = require("./src/constants/roles");

const SALT_ROUNDS = 10;

const DEPARTMENTS = [
  { name: "Cardiology", description: "Heart and cardiovascular care" },
  { name: "General Medicine", description: "Primary and internal medicine" },
  { name: "Pediatrics", description: "Care for infants, children and adolescents" },
  { name: "Emergency", description: "Emergency and urgent care" },
  { name: "Pharmacy", description: "Medication dispensing and management" },
];

// [email, first, last, phone, role, specialization, departmentName]
const STAFF = [
  ["dr.ade@gmail.com", "Ade", "Bello", "+2348011110001", ROLES.DOCTOR, "Cardiologist", "Cardiology"],
  ["dr.chiamaka@gmail.com", "Chiamaka", "Okafor", "+2348011110002", ROLES.DOCTOR, "General Physician", "General Medicine"],
  ["nurse.emeka@gmail.com", "Emeka", "Nwosu", "+2348011110003", ROLES.NURSE, "Registered Nurse", "Pediatrics"],
  ["nurse.funmi@gmail.com", "Funmi", "Adeyemi", "+2348011110004", ROLES.NURSE, "Senior Nurse", "Emergency"],
  ["nurse.grace@gmail.com", "Grace", "Okeke", "+2348011110008", ROLES.NURSE, "Registered Nurse", "General Medicine"],
  ["pharm.ibrahim@gmail.com", "Ibrahim", "Yusuf", "+2348011110005", ROLES.PHARMACIST, "Pharmacist", "Pharmacy"],
  ["lab.kevin@gmail.com", "Kevin", "Udoh", "+2348011110006", ROLES.LAB_TECHNICIAN, "Lab Scientist", "General Medicine"],
  ["front.linda@gmail.com", "Linda", "Eze", "+2348011110007", ROLES.RECEPTIONIST, "Receptionist", "General Medicine"],
  ["billing.musa@gmail.com", "Musa", "Sani", "+2348011110009", ROLES.BILLING_STAFF, "Billing Officer", "General Medicine"],
];

// [email, first, last, phone, gender, bloodGroup, genotype, address, emergencyName, emergencyPhone, dob]
const PATIENTS = [
  ["patient.ada@gmail.com", "Ada", "Obi", "+2348022220001", "female", "O+", "AA", "12 Marina Road, Lagos", "Chioma Obi", "+2348099990001", "1990-04-12"],
  ["patient.bayo@gmail.com", "Bayo", "Akin", "+2348022220002", "male", "A+", "AO", "5 Broad Street, Ibadan", "Tunde Akin", "+2348099990002", "1985-11-03"],
  ["patient.collins@gmail.com", "Collins", "Nnaji", "+2348022220003", "male", "B+", "BO", "23 Independence Ave, Abuja", "Ngozi Nnaji", "+2348099990003", "1978-01-25"],
  ["patient.dora@gmail.com", "Dora", "Gambo", "+2348022220004", "female", "AB+", "AB", "9 Ring Road, Kaduna", "Adamu Gambo", "+2348099990004", "1995-07-19"],
  ["patient.efosa@gmail.com", "Efosa", "Idahosa", "+2348022220005", "male", "O-", "OO", "77 Benin-Owena Rd, Benin", "Osaro Idahosa", "+2348099990005", "1969-09-02"],
];

const DRUGS = [
  { name: "Paracetamol 500mg", genericName: "Acetaminophen", category: "Analgesic", unit: "tablet", reorderLevel: 200 },
  { name: "Amoxicillin 250mg", genericName: "Amoxicillin", category: "Antibiotic", unit: "capsule", reorderLevel: 150 },
  { name: "Metformin 500mg", genericName: "Metformin", category: "Antidiabetic", unit: "tablet", reorderLevel: 120 },
  { name: "Lisinopril 10mg", genericName: "Lisinopril", category: "Antihypertensive", unit: "tablet", reorderLevel: 100 },
  { name: "Ibuprofen 400mg", genericName: "Ibuprofen", category: "NSAID", unit: "tablet", reorderLevel: 180 },
  { name: "Omeprazole 20mg", genericName: "Omeprazole", category: "PPI", unit: "capsule", reorderLevel: 90 },
];

const LAB_TESTS = ["Fasting Blood Sugar", "Malaria Parasite Test", "Full Blood Count", "Lipid Profile"];

async function seed() {
  console.log("Seeding database...");

  await pool.query(
    `INSERT INTO departments (name, description)
     SELECT name, description FROM unnest($1::text[], $2::text[]) AS d(name, description)
     ON CONFLICT (name) DO NOTHING`,
    [DEPARTMENTS.map((d) => d.name), DEPARTMENTS.map((d) => d.description)]
  );

  const deptRows = await pool.query("SELECT id, name FROM departments");
  const deptIdByName = Object.fromEntries(deptRows.rows.map((r) => [r.name, r.id]));

  const admin = await pool.query(
    `SELECT id FROM users WHERE email = 'iyiakimopatrick2002@gmail.com'`
  );
  if (admin.rows.length) {
    await pool.query(
      `INSERT INTO staff_profiles (user_id, department_id, employee_no, specialization)
       VALUES ($1, $2, 'EMP-0001', 'System Administrator')
       ON CONFLICT (user_id) DO NOTHING`,
      [admin.rows[0].id, deptIdByName["General Medicine"]]
    );
  }

  const staffIds = {};
  for (const [email, first, last, phone, role, spec, deptName] of STAFF) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    let userId;
    if (existing.rows.length) {
      userId = existing.rows[0].id;
    } else {
      const hash = await bcrypt.hash("Password123!", SALT_ROUNDS);
      const ins = await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone_number, password, role, department_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [first, last, email, phone, hash, role, deptIdByName[deptName]] //(role && deptIdByName[deptName])
      );
      userId = ins.rows[0].id;
    }
    await pool.query(
      `INSERT INTO staff_profiles (user_id, department_id, employee_no, specialization)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO NOTHING`,
      [userId, deptIdByName[deptName], `EMP-${1500 + Object.keys(staffIds).length + 1}`, spec]
    );
    staffIds[email] = userId;
  }

  const patients = {};
  for (const [email, first, last, phone, gender, bg, gt, addr, emName, emPhone, dob] of PATIENTS) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    let userId;
    if (existing.rows.length) {
      userId = existing.rows[0].id;
    } else {
      const hash = await bcrypt.hash("Password123!", SALT_ROUNDS);
      const ins = await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone_number, password, role)
         VALUES ($1, $2, $3, $4, $5, 'patient') RETURNING id`,
        [first, last, email, phone, hash]
      );
      userId = ins.rows[0].id;
    }
    const p = await pool.query(
      `INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender, blood_group, genotype, address, emergency_contact_name, emergency_contact_phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING id`,
      [userId, first, last, dob, gender, bg, gt, addr, emName, emPhone]
    );
    const patId = p.rows[0] ? p.rows[0].id : (await pool.query("SELECT id FROM patients WHERE user_id=$1", [userId])).rows[0].id;
    patients[email] = patId;
  }

  const drugIdMap = {};
  for (const d of DRUGS) {
    const existing = await pool.query("SELECT id FROM drugs WHERE name = $1", [d.name]);
    if (existing.rows[0]) {
      drugIdMap[d.name] = existing.rows[0].id;
      continue;
    }
    const ins = await pool.query(
      `INSERT INTO drugs (name, generic_name, category, unit, reorder_level)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [d.name, d.genericName, d.category, d.unit, d.reorderLevel]
    );
    drugIdMap[d.name] = ins.rows[0].id;
  }

  const patientEmails = Object.keys(patients);
  const doctorEmails = STAFF.filter((s) => s[4] === ROLES.DOCTOR).map((s) => s[0]);
  const femalePatient = patientEmails[0];

  const appointments = [
    { p: patientEmails[0], d: doctorEmails[0], reason: "Chest pain and palpitations", dept: "Cardiology", status: "confirmed", days: -2 },
    { p: patientEmails[1], d: doctorEmails[1], reason: "Routine checkup", dept: "General Medicine", status: "scheduled", days: 1 },
    { p: patientEmails[2], d: doctorEmails[0], reason: "Hypertension follow-up", dept: "Cardiology", status: "in_progress", days: 0 },
    { p: patientEmails[3], d: doctorEmails[1], reason: "Diabetes review", dept: "General Medicine", status: "scheduled", days: 3 },
    { p: patientEmails[4], d: doctorEmails[0], reason: "ECG and stress test", dept: "Cardiology", status: "scheduled", days: 2 },
  ];
  for (const a of appointments) {
    const dt = new Date(Date.now() + a.days * 86400000).toISOString();
    await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, department_id, reason, scheduled_at, status)
       SELECT $1, $2, $3, $4, $5, $6
       WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE patient_id=$1 AND reason=$4 AND date(scheduled_at)=date($5::timestamptz))`,
      [patients[a.p], staffIds[a.d], deptIdByName[a.dept], a.reason, dt, a.status]
    );
  }

  const prescriptions = [
    { p: patientEmails[0], d: doctorEmails[0], instructions: "Take one tablet every 8 hours after food", items: [["Paracetamol 500mg", "1x8hrly", 30], ["Omeprazole 20mg", "1 daily", 14]] },
    { p: patientEmails[2], d: doctorEmails[0], instructions: "Take daily in the morning", items: [["Lisinopril 10mg", "1 daily", 30], ["Ibuprofen 400mg", "as needed", 10]] },
  ];
  for (const pr of prescriptions) {
    const ins = await pool.query(
      `INSERT INTO prescriptions (patient_id, doctor_id, status, instructions)
       SELECT $1, $2, 'active', $3
       WHERE NOT EXISTS (SELECT 1 FROM prescriptions WHERE patient_id=$1 AND instructions=$3)
       RETURNING id`,
      [patients[pr.p], staffIds[pr.d], pr.instructions]
    );
    if (!ins.rows[0]) continue;
    for (const [drugName, dosage, qty] of pr.items) {
      if (!drugIdMap[drugName]) continue;
      await pool.query(
        `INSERT INTO prescription_items (prescription_id, drug_id, dosage, quantity)
         VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [ins.rows[0].id, drugIdMap[drugName], dosage, qty]
      );
    }
  }

  const labSeed = [
    { p: patientEmails[0], name: "Fasting Blood Sugar", priority: "routine" },
    { p: patientEmails[1], name: "Malaria Parasite Test", priority: "urgent" },
    { p: patientEmails[2], name: "Lipid Profile", priority: "routine" },
    { p: patientEmails[3], name: "Full Blood Count", priority: "routine" },
  ];
  for (const l of labSeed) {
    await pool.query(
      `INSERT INTO lab_requests (patient_id, requested_by_user_id, test_name, status, priority)
       SELECT $1, $2, $3, 'requested', $4
       WHERE NOT EXISTS (SELECT 1 FROM lab_requests WHERE patient_id=$1 AND test_name=$3)
       RETURNING id`,
      [patients[l.p], staffIds[doctorEmails[0]], l.name, l.priority]
    );
  }

  const invoices = [
    { p: patientEmails[0], subtotal: 45000, discount: 0, tax: 4500, status: "paid" },
    { p: patientEmails[1], subtotal: 120000, discount: 10000, tax: 11000, status: "partially_paid" },
    { p: patientEmails[2], subtotal: 250000, discount: 0, tax: 25000, status: "issued" },
  ];
  for (const inv of invoices) {
    const total = inv.subtotal - inv.discount + inv.tax;
    await pool.query(
      `INSERT INTO invoices (patient_id, status, subtotal, discount, tax, total, issued_by_user_id)
       SELECT $1, $2, $3, $4, $5, $6, $7
       WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE patient_id=$1 AND total=$6)
       RETURNING id`,
      [patients[inv.p], inv.status, inv.subtotal, inv.discount, inv.tax, total, staffIds["billing.musa@gmail.com"]]
    );
  }

  const admission = await pool.query(
    `SELECT id FROM rooms WHERE number = 'A-101'`
  );
  let roomId = admission.rows[0]?.id;
  if (!roomId) {
    const r = await pool.query(
      `INSERT INTO rooms (number, room_type, department_id, capacity, daily_rate)
       VALUES ('A-101','general',$1,4,15000) RETURNING id`,
      [deptIdByName["General Medicine"]]
    );
    roomId = r.rows[0].id;
  }
  await pool.query(
    `INSERT INTO admissions (patient_id, room_id, admitted_by_user_id, status, reason)
     SELECT $1, $2, $3, 'admitted', 'Routine observation'
     WHERE NOT EXISTS (SELECT 1 FROM admissions WHERE patient_id=$1 AND status='admitted')
     RETURNING id`,
    [patients[patientEmails[2]], roomId, staffIds[doctorEmails[0]]]
  );

  console.log("Seeding complete.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
