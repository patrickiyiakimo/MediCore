const pool = require("../config/db");

const listPatients = async ({ limit = 20, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id, user_id, first_name, last_name, date_of_birth, gender,
              blood_group, genotype, address, emergency_contact_name,
              emergency_contact_phone, created_at
       FROM patients
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [safeLimit, safeOffset]
    ),
    pool.query(
      "SELECT COUNT(*)::int AS total FROM patients WHERE deleted_at IS NULL"
    ),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT id, user_id, first_name, last_name, date_of_birth, gender,
            blood_group, genotype, address, emergency_contact_name,
            emergency_contact_phone, created_at
     FROM patients WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );
  return result.rows[0] || null;
};

const create = async (data) => {
  const result = await pool.query(
    `INSERT INTO patients
       (user_id, first_name, last_name, date_of_birth, gender, blood_group,
        genotype, address, emergency_contact_name, emergency_contact_phone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, user_id, first_name, last_name, date_of_birth, gender,
               blood_group, genotype, address, emergency_contact_name,
               emergency_contact_phone, created_at`,
    [
      data.userId || null,
      data.firstName,
      data.lastName,
      data.dateOfBirth || null,
      data.gender || null,
      data.bloodGroup || null,
      data.genotype || null,
      data.address || null,
      data.emergencyContactName || null,
      data.emergencyContactPhone || null,
    ]
  );
  return result.rows[0];
};

module.exports = {
  listPatients,
  findById,
  create,
};
