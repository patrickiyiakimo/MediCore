const { Pool } = require("pg");
const env = require("./env");

/**
 * PostgreSQL connection pool.
 * Connection pooling keeps the API fast under concurrent load.
 */
const pool = new Pool({
  user: env.db.user,
  password: env.db.password,
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
});

module.exports = pool;
