const pool = require("../config/db");

const listDepartments = async () => {
  const result = await pool.query(
    `SELECT d.id, d.name, d.description, d.head_user_id,
            u.first_name AS head_first_name, u.last_name AS head_last_name
     FROM departments d
     LEFT JOIN users u ON u.id = d.head_user_id
     WHERE d.deleted_at IS NULL
     ORDER BY d.name ASC`
  );
  return result.rows;
};

module.exports = {
  listDepartments,
};
