import { readFileSync } from "fs";
import { Pool } from "pg"; // Use Pool
import dotenv from "dotenv";
import { join } from "path";

dotenv.config();

const caCertPath = join(__dirname, "ca.pem");
const caCertificate = readFileSync(caCertPath, "utf-8");

// PostgreSQL Connection Pool (Named as `client`)
const client = new Pool({
  user: process.env.AIVEN_PG_USER || "",
  password: process.env.AIVEN_PG_PASSWORD || "",
  host: process.env.AIVEN_PG_HOST || "",
  port: parseInt(process.env.AIVEN_PG_PORT || "12354", 10),
  database: process.env.AIVEN_PG_DATABASE || "",
  ssl: {
    rejectUnauthorized: true,
    ca: caCertificate,
  },
  max: 10, // Maximum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout if connection takes too long
});

// Auto-reconnect logic
async function connectToDatabase() {
  while (true) {
    try {
      const conn = await client.connect();
      console.log("✅ PostgreSQL Pool connected!");
      conn.release();
      break;
    } catch (error) {
      console.error("❌ Database connection failed. Retrying in 5s...");
      console.error(error);
      await new Promise((res) => setTimeout(res, 5000)); // Retry in 5s
    }
  }
}

client.on("error", (err) => {
  console.error("⚠️ Unexpected DB error:", err);
  console.log("Reconnecting...");
  connectToDatabase();
});

connectToDatabase();

export  {client};


// import { readFileSync } from 'fs';
// import { Client } from 'pg';
// import dotenv from 'dotenv';
// import { join } from 'path';

// dotenv.config();
// const caCertPath = join(__dirname, 'ca.pem');
// const caCertificate = readFileSync(caCertPath, 'utf-8');

// interface PgConfig {
//   user: string;
//   password: string;
//   host: string;
//   port: number;
//   database: string;
//   ssl: {
//     rejectUnauthorized: boolean;
//     ca: string;
//   };
// }

// const config: PgConfig = {
//   user: process.env.AIVEN_PG_USER || '',
//   password: process.env.AIVEN_PG_PASSWORD || '',
//   host: process.env.AIVEN_PG_HOST || '',
//   port: parseInt(process.env.AIVEN_PG_PORT || '12354', 10), // Default to 5432 if not specified
//   database: process.env.AIVEN_PG_DATABASE || '',
//   ssl: {
//     rejectUnauthorized: true,
//     ca: caCertificate, 
//   },
// };

// export const client = new Client(config);
