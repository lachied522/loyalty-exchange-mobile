import type { Tables } from "./supabase";

export type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

export type Reward = Tables<'rewards'> & {
    reward_types: Tables<'reward_types'> | null
}

export type UserData = {
    
}