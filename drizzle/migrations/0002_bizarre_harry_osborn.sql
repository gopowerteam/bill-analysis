ALTER TABLE "public"."batch" ALTER COLUMN "channel" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."transaction" ALTER COLUMN "transaction_channel" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."transaction_channel_fields";--> statement-breakpoint
CREATE TYPE "public"."transaction_channel_fields" AS ENUM('AliPay', 'WxPay');--> statement-breakpoint
ALTER TABLE "public"."batch" ALTER COLUMN "channel" SET DATA TYPE "public"."transaction_channel_fields" USING "channel"::"public"."transaction_channel_fields";--> statement-breakpoint
ALTER TABLE "public"."transaction" ALTER COLUMN "transaction_channel" SET DATA TYPE "public"."transaction_channel_fields" USING "transaction_channel"::"public"."transaction_channel_fields";