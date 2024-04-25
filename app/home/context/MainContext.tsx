import { useState, createContext, useContext } from "react";

const MainContext = createContext<any>(null);

export const useMainContext = () => {
    return useContext(MainContext);
}

export type MainState = {
    myRewardsIsOpen: boolean,
    setMyRewardsIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MainContextProvider({ children }: { children: React.ReactNode }) {
    // could use reducer here but can't be bothered    
    const [myRewardsIsOpen, setMyRewardsIsOpen] = useState<boolean>(false); // controls whether the My Rewards modal is open

    return (
        <MainContext.Provider value={{
            myRewardsIsOpen,
            setMyRewardsIsOpen,
        }}>
            {children}
        </MainContext.Provider>
    )
}