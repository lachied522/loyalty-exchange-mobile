import type { Database } from "./supabase";

export type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

export type PointsBalance = Database['public']['Tables']['points']['Row'] & Database['public']['Tables']['stores']['Row'];