CREATE TYPE "public"."status" AS ENUM('online', 'offline');--> statement-breakpoint
CREATE TABLE "instances" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "instances_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"url" text NOT NULL,
	"status" "status",
	"interval" integer NOT NULL,
	"response_time" text,
	"uptime" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
