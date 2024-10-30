CREATE TABLE IF NOT EXISTS "record" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "batch_record" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"batch_id" text NOT NULL,
	"record_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "count" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "batch_record" ADD CONSTRAINT "batch_record_batch_id_batch_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batch"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "batch_record" ADD CONSTRAINT "batch_record_record_id_record_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."record"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
