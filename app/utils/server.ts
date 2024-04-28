
import { supabase } from "@/lib/supabase";

import { BACKEND_URL } from "@env";

export async function makeAuthenticatedRequest() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('User not logged in');
    }

    await fetch(`${BACKEND_URL}/api/refresh-user`, {
        method: 'GET',
        headers: {
            'token': session.access_token,
        }
    })
    .then((res) => res.json())
    .then((res) => console.log(res));

}