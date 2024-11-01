import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  // password: "bellator89", // Hard-coded for testing
  port: parseInt(process.env.DATABASE_PORT as string, 10),
});

export default pool;
