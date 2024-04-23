import { useState, createContext, useContext } from "react";

const MainContext = createContext<any>(null);

export const useMainContext = () => {
    return useContext(MainContext);
}

export type MainState = {
    username: string,
    email: string,
    mobile: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setMobile: React.Dispatch<React.SetStateAction<string>>
}

export default function MainContextProvider({ children }: { children: React.ReactNode }) {
    // could use reducer here but can't be bothered    
    const [username, setUsername] = useState('testUser');
    const [email, setEmail] = useState('test@test.com'); // TODO: remove defaults!!!
    const [mobile, setMobile] = useState('0400527849');

    return (
        <MainContext.Provider value={{
            username,
            email,
            mobile,
            setUsername,
            setEmail,
            setMobile,
        }}>
            {children}
        </MainContext.Provider>
    )
}