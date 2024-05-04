import { supabase } from "@/lib/supabase";

export async function fetchStoresById(stores: string[]) {
    const { data, error } = await supabase
    .from('stores')
    .select('*, reward_types(*)')
    .in('id', stores);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
    };

    return data;
}