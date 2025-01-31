import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import { DATABASE_URL } from "@utils/constants";

import * as userTables from "@models/users";

dotenv.config();

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { ...userTables },
});

console.log("Database connected successfully");
