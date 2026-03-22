CREATE TABLE "confirm_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"participant_id" uuid NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "confirm_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE INDEX "confirm_tokens_token_idx" ON "confirm_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "confirm_tokens_participant_idx" ON "confirm_tokens" USING btree ("participant_id");