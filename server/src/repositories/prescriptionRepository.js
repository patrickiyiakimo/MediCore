const pool = require("../config/db");

const listPrescriptions = async ({ limit = 20, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT pr.id, pr.patient_id, pr.doctor_id, pr.status, pr.instructions,
              pr.created_at,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              u.first_name AS doctor_first_name, u.last_name AS doctor_last_name,
              COALESCE(
                json_agg(json_build_object('name', d.name, 'dosage', pi.dosage, 'quantity', pi.quantity)) FILTER (WHERE d.id IS NOT NULL),
                '[]'::json
              ) AS items
       FROM prescriptions pr
       JOIN patients p ON p.id = pr.patient_id
       JOIN users u ON u.id = pr.doctor_id
       LEFT JOIN prescription_items pi ON pi.prescription_id = pr.id
       LEFT JOIN drugs d ON d.id = pi.drug_id
       GROUP BY pr.id, p.first_name, p.last_name, u.first_name, u.last_name
       ORDER BY pr.created_at DESC
       LIMIT $1 OFFSET $2`,
      [safeLimit, safeOffset]
    ),
    pool.query("SELECT COUNT(*)::int AS total FROM prescriptions"),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

module.exports = {
  listPrescriptions,
};
