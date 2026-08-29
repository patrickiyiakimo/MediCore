const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const env = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const createRateLimiter = require("./middlewares/rateLimiter");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (env.nodeEnv !== "test") {
  app.use(morgan("combined"));
}

app.use(createRateLimiter());

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
    status: 404,
  });
});

app.use(errorHandler);

module.exports = app;
