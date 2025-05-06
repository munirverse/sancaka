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

export const instanceStatusEnum = pgEnum("status", ["online", "offline"]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "telegram",
  "slack",
]);

export const instances = pgTable("instances", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: instanceStatusEnum(),
  interval: integer().notNull(), // in seconds
  responseTime: text("response_time"),
  uptime: decimal("uptime", { precision: 5, scale: 2 }),
  notificationId: integer("notification_id").references(
    () => notifications.id,
    { onDelete: "set null" }
  ),
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

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  type: notificationTypeEnum("type").notNull(),
  details: jsonb("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
