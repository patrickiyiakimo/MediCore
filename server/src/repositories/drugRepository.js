const pool = require("../config/db");

const listDrugs = async ({ limit = 50, offset = 0, search = "" } = {}) => {
  const safeLimit = Math.min(Number(limit) || 50, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const safeSearch = `%${search || ""}%`;

  const conditions = ["deleted_at IS NULL"];
  const params = [];
  if (search) {
    params.push(safeSearch);
    conditions.push(`(name ILIKE $${params.length} OR generic_name ILIKE $${params.length})`);
  }
  const where = conditions.length > 1 ? `WHERE ${conditions.join(" AND ")}` : `WHERE ${conditions[0]}`;
  const limitOffset = params.concat([safeLimit, safeOffset]);
  const limitClause = `LIMIT $${limitOffset.length - 1} OFFSET $${limitOffset.length}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id, name, generic_name, category, unit, reorder_level, created_at
       FROM drugs ${where} ORDER BY name ASC ${limitClause}`,
      limitOffset
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM drugs ${where}`, params),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

const create = async (data) => {
  const result = await pool.query(
    `INSERT INTO drugs (name, generic_name, category, unit, reorder_level)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, generic_name, category, unit, reorder_level`,
    [data.name, data.genericName || null, data.category || null, data.unit || null, data.reorderLevel || 0]
  );
  return result.rows[0];
};

module.exports = {
  listDrugs,
  create,
};
