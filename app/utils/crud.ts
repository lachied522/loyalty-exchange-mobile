import { supabase } from "@/lib/supabase";

export async function fetchStoresById(stores: string[]) {
    const { data, error } = await supabase
    .from('stores')
    .select('*, rewards(*)')
    .in('id', stores);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
    };

    return data;
}

export async function searchStoresByName(query: string) {
    const { data, error } = await supabase
    .from('stores')
    .select('*')
    .textSearch('name', `'${query}'`, { type: 'websearch' });
    // const { data, error } = await supabase.rpc('search_store_names', { query });

    if (error) return null;

    return data;
}