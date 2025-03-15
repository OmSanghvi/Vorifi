import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { watchlist } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
    .get("/", clerkMiddleware(), async (c) => {
        const auth = getAuth(c);
        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        try {
            const data = await db.select().from(watchlist).where(eq(watchlist.userId, auth.userId));
            return c.json({ data });
        } catch (error) {
            console.error('Database error:', error);
            return c.json({ error: "Database error" }, 500);
        }
    })
    .post("/", clerkMiddleware(), async (c) => {
        const auth = getAuth(c);
        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        try {
            const body = await c.req.json();

            // Check if user already has a watchlist
            const existingWatchlist = await db.select()
                .from(watchlist)
                .where(eq(watchlist.userId, auth.userId));

            if (existingWatchlist.length > 0) {
                // Update existing watchlist
                const [data] = await db.update(watchlist)
                    .set({ watchlist: body.watchlist })
                    .where(eq(watchlist.userId, auth.userId))
                    .returning();
                return c.json({ data });
            } else {
                // Create new watchlist
                const [data] = await db.insert(watchlist)
                    .values({
                        id: createId(),
                        userId: auth.userId,
                        watchlist: body.watchlist,
                    })
                    .returning();
                return c.json({ data });
            }
        } catch (error) {
            console.error('Database error:', error);
            return c.json({ error: "Database error" }, 500);
        }
    });

export default app;