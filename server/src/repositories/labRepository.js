const pool = require("../config/db");

const listLabRequests = async ({ limit = 20, offset = 0, status = "" } = {}) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const conditions = ["1 = 1"];
  const params = [];
  if (status) {
    params.push(status);
    conditions.push(`lr.status = $${params.length}`);
  }
  const where = `WHERE ${conditions.join(" AND ")}`;
  const limitOffset = params.concat([safeLimit, safeOffset]);
  const limitClause = `LIMIT $${limitOffset.length - 1} OFFSET $${limitOffset.length}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT lr.id, lr.patient_id, lr.test_name, lr.status, lr.priority,
              lr.notes, lr.created_at,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              req.first_name AS requested_by_first, req.last_name AS requested_by_last,
              res.summary AS result_summary
       FROM lab_requests lr
       JOIN patients p ON p.id = lr.patient_id
       JOIN users req ON req.id = lr.requested_by_user_id
       LEFT JOIN lab_results res ON res.lab_request_id = lr.id
       ${where}
       ORDER BY lr.created_at DESC
       ${limitClause}`,
      limitOffset
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM lab_requests lr ${where}`, params),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

module.exports = {
  listLabRequests,
};
