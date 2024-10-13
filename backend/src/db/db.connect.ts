import { readFileSync } from 'fs';
import { Client } from 'pg';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();
const caCertPath = join(__dirname, 'ca.pem');
const caCertificate = readFileSync(caCertPath, 'utf-8');

interface PgConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  ssl: {
    rejectUnauthorized: boolean;
    ca: string;
  };
}

const config: PgConfig = {
  user: process.env.AIVEN_PG_USER || '',
  password: process.env.AIVEN_PG_PASSWORD || '',
  host: process.env.AIVEN_PG_HOST || '',
  port: parseInt(process.env.AIVEN_PG_PORT || '12354', 10), // Default to 5432 if not specified
  database: process.env.AIVEN_PG_DATABASE || '',
  ssl: {
    rejectUnauthorized: true,
    ca: caCertificate, 
  },
};

export const client = new Client(config);
