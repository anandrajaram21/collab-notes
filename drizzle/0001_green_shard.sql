ALTER TABLE "connected_users" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "connected_users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "connected_users" ALTER COLUMN "note_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "id" DROP DEFAULT;