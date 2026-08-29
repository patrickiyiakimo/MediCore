const pool = require("../config/db");

/**
 * Data access layer for users.
 * Contains ONLY SQL and database operations (no business logic).
 */
const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL",
    [email]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, phone_number, role
     FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );
  return result.rows[0] || null;
};

const listUsers = async ({ limit = 20, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id, first_name, last_name, email, phone_number, role, created_at
       FROM users
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [safeLimit, safeOffset]
    ),
    pool.query(
      "SELECT COUNT(*)::int AS total FROM users WHERE deleted_at IS NULL"
    ),
  ]);

  return {
    data: dataResult.rows,
    meta: {
      total: countResult.rows[0].total,
      limit: safeLimit,
      offset: safeOffset,
    },
  };
};

const create = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role,
  } = userData;

  const columns = ["first_name", "last_name", "email", "phone_number", "password"];
  const values = [firstName, lastName, email, phoneNumber, password];

  if (role) {
    columns.push("role");
    values.push(role);
  }

  const placeholders = columns.map((_, i) => `$${i + 1}`);

  const result = await pool.query(
    `INSERT INTO users
       (${columns.join(", ")})
     VALUES (${placeholders.join(", ")})
     RETURNING id, first_name, last_name, email, phone_number, role`,
    values
  );

  return result.rows[0];
};

module.exports = {
  findByEmail,
  findById,
  create,
  listUsers,
};
