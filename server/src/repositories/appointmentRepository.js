const pool = require("../config/db");

const list = async ({ limit = 20, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT a.id, a.patient_id, a.doctor_id, a.department_id, a.reason,
              a.scheduled_at, a.status, a.notes, a.created_at,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              u.first_name AS doctor_first_name, u.last_name AS doctor_last_name,
              d.name AS department_name
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN users u ON u.id = a.doctor_id
       LEFT JOIN departments d ON d.id = a.department_id
       ORDER BY a.scheduled_at DESC
       LIMIT $1 OFFSET $2`,
      [safeLimit, safeOffset]
    ),
    pool.query("SELECT COUNT(*)::int AS total FROM appointments"),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

const create = async (data) => {
  const result = await pool.query(
    `INSERT INTO appointments
       (patient_id, doctor_id, department_id, reason, scheduled_at, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, patient_id, doctor_id, department_id, reason, scheduled_at, status, notes`,
    [
      data.patientId,
      data.doctorId,
      data.departmentId || null,
      data.reason || null,
      data.scheduledAt,
      data.status || "scheduled",
      data.notes || null,
    ]
  );
  return result.rows[0];
};

module.exports = {
  list,
  create,
};
