const pool = require("../config/db");

const listInvoices = async ({ limit = 20, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 20, 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT i.id, i.patient_id, i.status, i.subtotal, i.discount, i.tax,
              i.total, i.created_at,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name
       FROM invoices i
       JOIN patients p ON p.id = i.patient_id
       ORDER BY i.created_at DESC
       LIMIT $1 OFFSET $2`,
      [safeLimit, safeOffset]
    ),
    pool.query("SELECT COUNT(*)::int AS total FROM invoices"),
  ]);

  return {
    data: dataResult.rows,
    meta: { total: countResult.rows[0].total, limit: safeLimit, offset: safeOffset },
  };
};

module.exports = {
  listInvoices,
};
