CREATE TABLE "instances" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"status" varchar(7) NOT NULL,
	"interval" integer NOT NULL,
	"response_time" text,
	"uptime" numeric(5, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
