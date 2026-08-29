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

const create = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role = "staff",
  } = userData;

  const result = await pool.query(
    `INSERT INTO users
       (first_name, last_name, email, phone_number, password, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, first_name, last_name, email, phone_number, role`,
    [firstName, lastName, email, phoneNumber, password, role]
  );

  return result.rows[0];
};

module.exports = {
  findByEmail,
  findById,
  create,
};
