const pool = require("../config/db");

const listStaff = async ({ role, limit = 50, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 50, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const conditions = ["u.deleted_at IS NULL"];
  const params = [];

  if (role) {
    params.push(role);
    conditions.push(`u.role = $${params.length}`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  const limitOffsetParams = params.concat([safeLimit, safeOffset]);
  const limitClause = `LIMIT $${limitOffsetParams.length - 1} OFFSET $${limitOffsetParams.length}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone_number,
              u.role, u.is_active,
              sp.specialization, sp.employee_no,
              d.name AS department_name
       FROM users u
       LEFT JOIN staff_profiles sp ON sp.user_id = u.id
       LEFT JOIN departments d ON d.id = COALESCE(sp.department_id, u.department_id)
       ${where}
       ORDER BY u.last_name ASC
       ${limitClause}`,
      limitOffsetParams
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM users u ${where}`,
      params
    ),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

module.exports = {
  listStaff,
};
