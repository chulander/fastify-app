import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = () =>
  uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`);

export const createdAt = () =>
  timestamp("created_at", { precision: 6, withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull();

export const editedAt = () =>
  timestamp("edited_at", { precision: 6, withTimezone: true }).default(sql`CURRENT_TIMESTAMP`);
