import {
  pgTable,
  text,
  decimal,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["online", "offline"]);

export const instances = pgTable("instances", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: statusEnum(),
  interval: integer().notNull(),
  responseTime: text("response_time"),
  uptime: decimal("uptime", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
