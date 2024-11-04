ALTER TABLE "batch" ALTER COLUMN "count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "batch_record" ADD CONSTRAINT "batch_record_batch_id_record_id_pk" PRIMARY KEY("batch_id","record_id");--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "in_amount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "out_amount" integer NOT NULL;