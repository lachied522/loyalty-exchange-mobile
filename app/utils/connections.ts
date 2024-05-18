import type { Session } from "@supabase/supabase-js";

export async function getConsentURL(
    session: Session,
    action: 'manage'|'connect'
): Promise<string | null> {
    // returns url for consent UI for corresponding action
    const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/manage-user-connections/${session.user.id}`,
        {
            method: 'GET',
            headers: {
                token: session.access_token,
                action,
            }
        }
    );

    if (!res.ok) {
        return null;
    }

    return await res.json().then(({ url }) => url);
}

export async function createNewConnection(
    session: Session
): Promise<string | null> {
    // returns url for consent UI for new connection
    const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/create-new-connection/${session.user.id}`,
        {
          method: 'GET',
          headers: {
            'token': session.access_token,
          }
        }
    );

    if (!res.ok) {
        return null;
    }

    return await res.json().then(({ url }) => url);
}