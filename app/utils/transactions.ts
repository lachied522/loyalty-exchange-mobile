import { getBasiqServerAccessToken } from "@/lib/basiq";

import type { Transaction } from "@/types/basiq";

export async function fetchUserTransactions(
    BasiqUserId: string | null,
    limit: number = 10
): Promise<Transaction[]> {
    if (!BasiqUserId) return [];
    // get Basiq access token
    const BasiqServerAccessToken = await getBasiqServerAccessToken();

    // get last 10 transactions
    // it is possible user makes more than 10 transactions before we can update their point counts
    return fetch(`https://au-api.basiq.io/users/${BasiqUserId}/transactions?limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${BasiqServerAccessToken}`,
            'Accept': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((res) => res.data);
}