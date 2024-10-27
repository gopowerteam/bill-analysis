ALTER TABLE "transaction" ALTER COLUMN "transaction_mark" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "transaction_method" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "merchant_no" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "account" text NOT NULL;