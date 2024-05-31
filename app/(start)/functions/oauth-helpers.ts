import type { Session } from '@supabase/supabase-js';

import type { UserMetadata } from '~/app/types/helpers';

export function processOAuthUserMetadata(session: Session): UserMetadata {
    // oauth users are created with the metadata supplied by provider
    // must process metadata for use in app

    let first_name = session.user.user_metadata['first_name'] || '';
    let last_name = session.user.user_metadata['last_name'] || '';
    let mobile = session.user.user_metadata['mobile'] || '';

    const name: string = (
        session.user.user_metadata['name'] ||
        session.user.user_metadata['full_name'] ||
        session.user.user_metadata['nickname']
    )

    if (name) {
        const names = name.split(' ');
        first_name = names[0];
        last_name = names.length > 1? names[1]: '';
    }

    return {
        email: session.user.email,
        first_name,
        last_name,
        mobile,
    }
}