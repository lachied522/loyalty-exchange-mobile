import { useState, createContext, useContext } from "react";

import type { Session } from "@supabase/supabase-js";

const StartContext = createContext<any>(null);

export const useStartContext = () => {
    return useContext(StartContext);
}

export type StartState = {
    session: Session | null, 
    username: string,
    email: string, 
    mobile: string, 
    setSession: React.Dispatch<React.SetStateAction<Session | null>>,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setMobile: React.Dispatch<React.SetStateAction<string>>
}

export default function StartContextProvider({ children }: { children: React.ReactNode }) {
    // could use reducer here but can't be bothered    
    const [session, setSession] = useState<Session | null>(null);
    const [username, setUsername] = useState('testUser');
    const [email, setEmail] = useState('test@test.com'); // TODO: remove defaults!!!
    const [mobile, setMobile] = useState('0400527849');

    return (
        <StartContext.Provider value={{
            session,
            username,
            email,
            mobile,
            setSession,
            setUsername,
            setEmail,
            setMobile,
        }}>
            {children}
        </StartContext.Provider>
    )

}