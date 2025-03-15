CREATE TABLE IF NOT EXISTS "watchlist" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"watchlist" text NOT NULL
);
