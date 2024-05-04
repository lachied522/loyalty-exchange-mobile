import type { Transaction } from "./basiq";
import type { Tables } from "./supabase";

import { icons } from 'lucide-react-native';

export type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

export type UserData = (
    Tables<'users'> & {
        points: (
            Tables<'points'> & {
                stores: Tables<'stores'> & {
                    reward_types: Tables<'reward_types'>
                }
            }
        )[]
        rewards: (
            Tables<'rewards'> & {
                reward_types: Tables<'reward_types'>
            }
        )[]
        transactions: Tables<'transactions'>[] // historical transactions
        newTransactions: Transaction[] // new transactions from Basiq API
    }
)

export type Reward = (
    Omit<Tables<'reward_types'>, 'icon_name'> & {
        icon_name: keyof typeof icons | null
    }
)

export type StoreData = (
    Tables<'stores'> & {
        reward_types: Reward[]
    }
)