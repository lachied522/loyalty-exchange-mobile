import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { getConsentURL } from "@/utils/connections";

import type { Session } from "@supabase/supabase-js";
import type { UserMetadata } from "@/types/helpers";

export type GlobalState = {
    session: Session | null
    userMetadata?: UserMetadata,
    isAnonymous: boolean
    setUserMetadata: React.Dispatch<React.SetStateAction<UserMetadata | undefined>>
    getConsentURLFromSession: (action: 'manage'|'connect') => Promise<string | null>
}

const GlobalContext = createContext<GlobalState>({
    session: null,
    userMetadata: {},
    isAnonymous: false,
    setUserMetadata: () => {},
    getConsentURLFromSession: async () => null
});

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

interface GlobalContextProps {
    session: Session | null,
    children: React.ReactNode
}

export default function GlobalContextProvider({ 
    session,
    children,
}: GlobalContextProps) {
    const [userMetadata, setUserMetadata] = useState<UserMetadata | undefined>();
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

    useEffect(() => {
        if (session) {
            setUserMetadata({
                ...session.user.user_metadata,
                email: session.user.email, // email has is stored separately from 'user_metadata'
            });

            setIsAnonymous(session.user.is_anonymous ?? false);
        }
    }, [session]);

    const getConsentURLFromSession = useCallback(
        async (action: 'manage'|'connect') => {
            if (!session) return null;

            return await getConsentURL(session, action);
        },
        [session]
    );

    return (
        <GlobalContext.Provider value={{
            session,
            isAnonymous,
            userMetadata,
            setUserMetadata,
            getConsentURLFromSession,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}