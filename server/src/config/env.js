const path = require("path");
require("dotenv").config({
  path: [
    path.join(__dirname, "..", "..", ".env"),
    path.join(__dirname, "..", "..", "..", ".env"),
  ],
});

/**
 * Centralised, validated access to environment variables.
 * Throw early if required values are missing.
 */
const getEnv = (key, fallback) => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: parseInt(getEnv("PORT", "5000"), 10),

  jwtSecret: getEnv("JWT_SECRET"),
  refreshSecret: getEnv("REFRESH_TOKEN_SECRET"),
  jwtExpiresIn: getEnv("JWT_EXPIRES_IN", "15m"),
  refreshExpiresIn: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),

  db: {
    user: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    host: getEnv("DB_HOST", "localhost"),
    port: parseInt(getEnv("DB_PORT", "5432"), 10),
    database: getEnv("DB_NAME"),
  },

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

module.exports = env;