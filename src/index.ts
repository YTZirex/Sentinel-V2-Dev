import CustomClient from "./base/classes/CustomClient";
import process from "node:process";

export function startBot() {
  new CustomClient().Init();
}

startBot();

process.on("unhandledRejection", async (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "\nReason:", reason);
});

process.on("uncaughtException", async (err) => {
  console.log("Uncaught Exception:", err);
});

process.on("uncaughtExceptionMonitor", async (err, origin) => {
  console.log("Uncaught Exception Monitor:", err, origin);
});
