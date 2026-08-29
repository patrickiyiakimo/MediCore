const pool = require("../config/db");

/**
 * Business logic for user management.
 */
const listUsers = async ({ limit = 20, offset = 0 }) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const result = await pool.query(
    `SELECT id, first_name, last_name, email, phone_number, role, created_at
     FROM users
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [safeLimit, safeOffset]
  );

  const count = await pool.query(
    "SELECT COUNT(*)::int AS total FROM users WHERE deleted_at IS NULL"
  );

  return {
    data: result.rows,
    meta: {
      total: count.rows[0].total,
      limit: safeLimit,
      offset: safeOffset,
    },
  };
};

module.exports = { listUsers };
