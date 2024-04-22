import { useState, useEffect, createContext, useContext } from "react";

import type { Session } from "@supabase/supabase-js";

import type { UserData } from "@/utils/data-fetching";

const GlobalContext = createContext<any>(null);

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export type GlobalState = {
    session: Session | null,
    userData: UserData
    username: string,
    email: string,
    mobile: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setMobile: React.Dispatch<React.SetStateAction<string>>
}

interface GlobalContextProps {
    session: Session | null,
    userData: UserData,
    children: React.ReactNode
}

export default function GlobalContextProvider({ 
    session,
    userData,
    children,
}: GlobalContextProps) {
    // could use reducer here but can't be bothered    
    const [username, setUsername] = useState('testUser');
    const [email, setEmail] = useState('test@test.com'); // TODO: remove defaults!!!
    const [mobile, setMobile] = useState('0400527849');

    return (
        <GlobalContext.Provider value={{
            session,
            userData,
            username,
            email,
            mobile,
            setUsername,
            setEmail,
            setMobile,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}