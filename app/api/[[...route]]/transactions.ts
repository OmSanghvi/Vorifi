import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { transactions, insertTransactionSchema, categories, accounts } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray, gte, lte, desc, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { parse, subDays } from "date-fns";

/**
 * Hono app instance for handling transaction-related API routes.
 */
const app = new Hono()

    /**
     * GET / - Fetches transactions for the authenticated user within a specified date range.
     * Requires user to be authenticated.
     * @param {string} [from] - The start date of the range (optional).
     * @param {string} [to] - The end date of the range (optional).
     * @param {string} [accountId] - The ID of the account to filter by (optional).
     */
    .get("/", zValidator("query", z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
    })), clerkMiddleware(), async (c) => {
        const auth = getAuth(c);
        const { from, to, accountId } = c.req.valid("query");

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);
        const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;
        const data = await db
            .select({
                id: transactions.id,
                date: transactions.date,
                category: categories.name,
                categoryId: transactions.categoryId,
                payee: transactions.payee,
                amount: transactions.amount,
                notes: transactions.notes,
                accountId: transactions.accountId,
                account: accounts.name,
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    accountId ? eq(transactions.accountId, accountId) : undefined,
                    eq(accounts.userId, auth.userId),
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate),
                )
            )
            .orderBy(desc(transactions.date));
        return c.json({
            data
        });
    })

    /**
     * GET /:id - Fetches a specific transaction by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the transaction to fetch.
     */
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const [data] = await db
                .select({
                    id: transactions.id,
                    date: transactions.date,
                    categoryId: transactions.categoryId,
                    payee: transactions.payee,
                    amount: transactions.amount,
                    notes: transactions.notes,
                    accountId: transactions.accountId,
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(transactions.id, id),
                        eq(accounts.userId, auth.userId),
                    ),
                );

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

    /**
     * POST / - Creates a new transaction for the authenticated user.
     * Requires user to be authenticated.
     * @param {object} body - The request body containing transaction details.
     * @param {string} body.date - The date of the transaction.
     * @param {string} body.categoryId - The ID of the category.
     * @param {string} body.payee - The payee of the transaction.
     * @param {number} body.amount - The amount of the transaction.
     * @param {string} body.notes - Additional notes for the transaction.
     * @param {string} body.accountId - The ID of the account.
     */
    .post("/", clerkMiddleware(), zValidator("json", insertTransactionSchema.omit({
        id: true
    })), async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db.insert(transactions).values({
            id: createId(),
            ...values
        }).returning();
        return c.json({ data });
    })

    /**
     * POST /bulk-create - Creates multiple transactions for the authenticated user.
     * Requires user to be authenticated.
     * @param {object[]} body - The request body containing an array of transaction details.
     */
    .post("/bulk-create", clerkMiddleware(), zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const [data] = await db
                .insert(transactions)
                .values(
                    values.map((value) => ({
                        id: createId(),
                        ...value,
                    }))
                ).returning();
            return c.json({ data });
        }
    )

    /**
     * POST /bulk-delete - Deletes multiple transactions for the authenticated user.
     * Requires user to be authenticated.
     * @param {object} body - The request body containing transaction IDs to delete.
     * @param {string[]} body.ids - The array of transaction IDs to delete.
     */
    .post("/bulk-delete", clerkMiddleware(), zValidator("json", z.object(
            { ids: z.array(z.string()) })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId) {
                return (c.json({ error: "Unauthorized" }, 401));
            }
            const transactionsToDelete = db.$with("transactions_to_delete").as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            inArray(transactions.id, values.ids),
                            eq(accounts.userId, auth.userId),
                        )
                    )
            );
            const data = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({ id: transactions.id });
            return c.json({ data });
        },
    )

    /**
     * PATCH /:id - Updates a transaction by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the transaction to update.
     * @param {object} body - The request body containing transaction details.
     * @param {string} body.date - The date of the transaction.
     * @param {string} body.categoryId - The ID of the category.
     * @param {string} body.payee - The payee of the transaction.
     * @param {number} body.amount - The amount of the transaction.
     * @param {string} body.notes - Additional notes for the transaction.
     * @param {string} body.accountId - The ID of the account.
     */
    .patch("/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        zValidator(
            "json",
            insertTransactionSchema.omit({
                id: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");
            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const transactionsToUpdate = db.$with("transactions_to_update").as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            eq(transactions.id, id),
                            eq(accounts.userId, auth.userId),
                        )
                    )
            );
            const [data] = await db
                .with(transactionsToUpdate)
                .update(transactions)
                .set(values)
                .where(inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)).returning();

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

    /**
     * DELETE /:id - Deletes a transaction by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the transaction to delete.
     */
    .delete("/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const transactionsToDelete = db.$with("transactions_to_delete").as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            eq(transactions.id, id),
                            eq(accounts.userId, auth.userId),
                        )
                    )
            );

            const [data] = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(
                        transactions.id,
                        sql`(select id from ${transactionsToDelete})`
                    )
                ).returning({ id: transactions.id, });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

export default app;