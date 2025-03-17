import dotenv from "dotenv";
import app from "./app";
import { client } from "./db/db.connect"; // Now using Pool

dotenv.config({
  path: "../.env",
});

const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("❌ Server error:", error);
});

// Handle client connection errors
server.on("clientError", (error, socket) => {
  console.error("⚠️ Client connection error:", error);
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

// Ensure DB connection is alive
async function checkDatabaseConnection() {
  while (true) {
    try {
      const res = await client.query("SELECT 1"); // Test query
      console.log("✅ PostgreSQL is connected!");
      break;
    } catch (error) {
      console.error("❌ Database connection failed. Retrying in 5s...");
      console.error(error);
      await new Promise((res) => setTimeout(res, 5000)); // Retry in 5s
    }
  }
}

// Auto-reconnect on database errors
client.on("error", (err) => {
  console.error("⚠️ Database error:", err);
  console.log("🔄 Reconnecting...");
  checkDatabaseConnection();
});

// Check DB connection on startup
checkDatabaseConnection();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("⚠️ Uncaught Exception:", error);
});
