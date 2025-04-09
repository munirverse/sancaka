import {
  pgTable,
  text,
  decimal,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

export const instances = pgTable("instances", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: varchar("status", { length: 7 })
    .notNull()
    .$type<"online" | "offline">(),
  interval: integer().notNull(),
  responseTime: text("response_time"),
  uptime: decimal("uptime", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
