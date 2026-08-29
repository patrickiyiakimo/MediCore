const env = require("./config/env");
const app = require("./app");

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

app.listen(env.port, () => {
  console.log(
    `MediCore server running on port ${env.port}`
  );
});
