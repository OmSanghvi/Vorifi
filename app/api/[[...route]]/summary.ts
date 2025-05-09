import {Hono} from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { subDays, parse, differenceInDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { accounts, categories, transactions } from "@/db/schema";
import { db } from "@/db/drizzle";
import { calculatePercentChange, fillMissingDays } from "@/lib/utils";

/**
 * Hono app instance for handling summary-related API routes.
 */
const app = new Hono()

    /**
     * GET / - Fetches financial summary data for the authenticated user within a specified date range.
     * Requires user to be authenticated.
     * @param {string} [from] - The start date of the range (optional).
     * @param {string} [to] - The end date of the range (optional).
     * @param {string} [accountId] - The ID of the account to filter by (optional).
     */
    .get("/", clerkMiddleware(), zValidator("query", z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional()
    })), async (c) => {
        const auth = getAuth(c);
        const { from, to, accountId } = c.req.valid("query");
        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);
        const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

        const periodLength = differenceInDays(endDate, startDate) + 1;
        const lastPeriodStart = subDays(startDate, periodLength);
        const lastPeriodEnd = subDays(endDate, periodLength);

        /**
         * Fetches financial data for a user within a specified date range.
         * @param {string} userId - The ID of the user.
         * @param {Date} startDate - The start date of the range.
         * @param {Date} endDate - The end date of the range.
         * @returns {Promise<Array<{ income: number, expenses: number, remaining: number }>>} The financial data.
         */
        async function fetchFinancialData(
            userId: string,
            startDate: Date,
            endDate: Date
        ) {
            return db.select({
                income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                remaining: sum(transactions.amount).mapWith(Number),
            })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate)
                    )
                );
        }

        const [currentPeriod] = await fetchFinancialData(
            auth.userId,
            startDate,
            endDate
        );

        const [lastPeriod] = await fetchFinancialData(
            auth.userId,
            lastPeriodStart,
            lastPeriodEnd
        );

        const incomeChange = calculatePercentChange(currentPeriod.income, lastPeriod.income);
        const expensesChange = calculatePercentChange(currentPeriod.expenses, lastPeriod.expenses);
        const remainingChange = calculatePercentChange(currentPeriod.remaining, lastPeriod.remaining);

        const category = await db
            .select({
                name: categories.name,
                value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
            }).from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .innerJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    accountId ? eq(transactions.accountId, accountId) : undefined,
                    eq(accounts.userId, auth.userId),
                    lt(transactions.amount, 0),
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate)
                )
            ).groupBy(categories.name)
            .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

        const topCategories = category.slice(0, 3);
        const otherCategories = category.slice(3);
        const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);
        const finalCategories = topCategories;
        if (otherCategories.length > 0) {
            finalCategories.push({
                name: "Other",
                value: otherSum,
            });
        }
        const activeDays = await db.select({
            date: transactions.date,
            income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number),
        }).from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
                and(
                    accountId ? eq(transactions.accountId, accountId) : undefined,
                    eq(accounts.userId, auth.userId),
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate)
                )
            ).groupBy(transactions.date).orderBy(transactions.date);

        const days = fillMissingDays(activeDays, startDate, endDate);

        return c.json({
            data: {
                remainingAmount: currentPeriod.remaining,
                remainingChange,
                incomeAmount: currentPeriod.income,
                incomeChange,
                expensesAmount: currentPeriod.expenses,
                expensesChange,
                categories: finalCategories,
                days,
            }
        });

    })

export default app;