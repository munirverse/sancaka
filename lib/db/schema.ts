import {
  pgTable,
  text,
  decimal,
  timestamp,
  pgEnum,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["online", "offline"]);

export const instances = pgTable("instances", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: statusEnum(),
  interval: integer().notNull(), // in seconds
  responseTime: text("response_time"),
  uptime: decimal("uptime", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const instanceStatusHistory = pgTable("instance_status_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  online: boolean("online").notNull(),
  instanceId: integer("instance_id")
    .references(() => instances.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
