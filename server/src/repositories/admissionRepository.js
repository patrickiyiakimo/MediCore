const pool = require("../config/db");

const listAdmissions = async ({ limit = 20, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT a.id, a.patient_id, a.room_id, a.admitted_at, a.discharge_at,
              a.status, a.reason, a.notes,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              r.number AS room_number, r.room_type
       FROM admissions a
       JOIN patients p ON p.id = a.patient_id
       LEFT JOIN rooms r ON r.id = a.room_id
       ORDER BY a.admitted_at DESC
       LIMIT $1 OFFSET $2`,
      [safeLimit, safeOffset]
    ),
    pool.query("SELECT COUNT(*)::int AS total FROM admissions"),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

module.exports = {
  listAdmissions,
};
