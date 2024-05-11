import { createContext, useContext } from "react";

import type { Session } from "@supabase/supabase-js";

const GlobalContext = createContext<any>(null);

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export type GlobalState = {
    session: Session | null
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