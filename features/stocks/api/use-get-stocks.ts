import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

/**
 * Custom hook to fetch transactions based on query parameters.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to fetch the transactions data.
 * It also converts the transaction amounts from miliunits to a more readable format.
 *
 * @returns {object} The query object returned by `useQuery`.
 * @throws {Error} If the API call fails.
 */
const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY6;

export const useGetStocks = () => {
    const query = useQuery({
        queryKey: ["stocks"],
        /**
         * Function to fetch the transactions data.
         *
         * @returns {Promise<object[]>} The fetched transactions data.
         * @throws {Error} If the API call fails.
         */
        queryFn: async () => {
            const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=apple&apikey=${API_KEY}`);

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const data = await response.json();
            return data.bestMatches.slice(0, 3).map((stock: any) => ({
                symbol: stock["1. symbol"],
                name: stock["2. name"],
            }));
        },
    });

    return query;
};