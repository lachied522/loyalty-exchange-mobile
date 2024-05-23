import { useState, createContext, useContext } from "react";

import type { Session } from "@supabase/supabase-js";

const StartContext = createContext<any>(null);

export const useStartContext = () => {
    return useContext(StartContext);
}

export type StartState = {
    session: Session | null, 
    setSession: React.Dispatch<React.SetStateAction<Session | null>>,
}

export default function StartContextProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);

    return (
        <StartContext.Provider value={{
            session,
            setSession,
        }}>
            {children}
        </StartContext.Provider>
    )

}