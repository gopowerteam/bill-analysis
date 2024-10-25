CREATE TYPE "public"."transaction_channel_fields" AS ENUM('Alipay', 'WxPay');--> statement-breakpoint
CREATE TYPE "public"."transaction_type_fields" AS ENUM('IN', 'OUT', 'OTHER');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "batch" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"channel" "transaction_channel_fields" NOT NULL,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"transaction_no" text PRIMARY KEY NOT NULL,
	"transaction_time" timestamp with time zone NOT NULL,
	"transaction_mark" text NOT NULL,
	"transaction_type" "transaction_type_fields" NOT NULL,
	"transaction_channel" "transaction_channel_fields" NOT NULL,
	"transaction_method" text NOT NULL,
	"transaction_amount" numeric NOT NULL,
	"counterparty" text NOT NULL,
	"merchant_no" text NOT NULL,
	"batch_id" text NOT NULL
);
