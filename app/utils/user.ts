import { supabase } from "../lib/supabase";

import type { UserMetadata } from "../types/helpers";

export async function updateUserMetaData({
    email,
    first_name,
    last_name,
    mobile,
    role
} : UserMetadata) {
    const { data: { user }, error: authError } = await supabase.auth.updateUser({
        email,
        data: {
            first_name,
            last_name,
            mobile,
            role,
        }
    });

    if (authError) throw authError;

    // update name column in 'users' table
    if (user && first_name) {
        const { error: commitError } = await supabase
        .from('users')
        .update({ name: first_name })
        .eq('id', user.id);
    }

    return user;
}