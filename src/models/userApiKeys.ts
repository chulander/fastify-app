import { uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { createdAt, editedAt, id } from "../utils/db";
import { users } from "./users";

export const userApiKeys = pgTable("user_api_keys", {
  id: id(),
  name: varchar("name", { length: 255 }).notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  key: text("key").notNull(),
  createdAt: createdAt(),
  editedAt: editedAt(),
});
