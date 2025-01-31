import { uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { createdAt, editedAt, id } from "../utils/db";

export const users = pgTable("users", {
  id: id(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: createdAt(),
  editedAt: editedAt(),
});
