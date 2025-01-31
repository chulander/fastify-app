import { uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";

import { createdAt, editedAt, id } from "../utils/db";

export const usersTable = pgTable("users", {
  id: id(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: createdAt(),
  editedAt: editedAt(),
});

export const usersApiKeysTable = pgTable("users_api_keys", {
  id: id(),
  name: varchar("name", { length: 255 }).notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  key: text("key").notNull(),
  createdAt: createdAt(),
  editedAt: editedAt(),
});
