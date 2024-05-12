import { createContext, useContext } from "react";

import type { Session } from "@supabase/supabase-js";

export type GlobalState = {
    session: Session | null
}

const GlobalContext = createContext<GlobalState>({
    session: null,
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

    return (
        <GlobalContext.Provider value={{
            session
        }}>
            {children}
        </GlobalContext.Provider>
    )
}