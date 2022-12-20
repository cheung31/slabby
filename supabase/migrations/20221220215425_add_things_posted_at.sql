alter table "public"."things" add column "posted_at" timestamp with time zone;

-- Backfill posted_at from content_date
UPDATE "public"."things" SET "posted_at" = "content_date";
