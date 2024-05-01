import type { Tables } from "./supabase";

export type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

export type Reward = Tables<'reward_types'>;

export type UserData = {
    
}