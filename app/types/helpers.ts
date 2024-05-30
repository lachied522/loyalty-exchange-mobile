import type { Transaction } from "./basiq";
import type { Tables } from "./supabase";

import { icons } from 'lucide-react-native';

export type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

export type UserData = (
    Tables<'users'> & {
        points: (
            Tables<'points'> & {
                stores: Tables<'stores'> & {
                    rewards: Tables<'rewards'>
                }
            }
        )[]
        redeemed: (
            Tables<'redeemed'> & {
                rewards: Tables<'rewards'>
            }
        )[]
        transactions: Tables<'transactions'>[] // historical transactions
    }
)

export type UserMetadata = {
    first_name?: string,
    last_name?: string,
    email?: string,
    mobile?: string,
    role?: 'user'|'client'
}

export type Reward = (
    Omit<Tables<'rewards'>, 'icon_name'> & {
        icon_name: keyof typeof icons | null
    }
)

export type StoreData = (
    Tables<'stores'> & {
        rewards: Reward[]
    }
)