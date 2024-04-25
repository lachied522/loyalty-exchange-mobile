import { useState, useEffect, createContext, useContext, useCallback, useReducer } from "react";

import type { Session } from "@supabase/supabase-js";

import { GlobalReducer, type Action } from "./GlobalReducer";

import { refreshUserData, setRewardRedeemed } from "@/utils/functions";

import { fetchUserData, type UserData } from "@/utils/crud";
import type { Reward } from "@/types/helpers";

const GlobalContext = createContext<any>(null);

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export type GlobalState = {
    session: Session | null
    userData: UserData
    username: string
    email: string
    mobile: string
    setUsername: React.Dispatch<React.SetStateAction<string>>
    setEmail: React.Dispatch<React.SetStateAction<string>>
    setMobile: React.Dispatch<React.SetStateAction<string>>
    dispath: React.Dispatch<Action>
    redeemReward: (reward: Reward) => Promise<void>
    refresh: () => Promise<void>
}

interface GlobalContextProps {
    session: Session | null,
    initialState: UserData,
    children: React.ReactNode
}

export default function GlobalContextProvider({ 
    session,
    initialState,
    children,
}: GlobalContextProps) {
    const [state, dispatch] = useReducer<typeof GlobalReducer>(GlobalReducer, initialState);
    const [username, setUsername] = useState('testUser');
    const [email, setEmail] = useState('test@test.com'); // TODO: remove defaults!!!
    const [mobile, setMobile] = useState('0400527849');

    const redeemReward = useCallback(
        async (reward: Reward) => {
            // if (!session) return Promise.reject('user not logged in');
            
            return setRewardRedeemed(reward, state)
            .then(() => {
                // update state
                dispatch({
                    type: 'REDEEM_REWARD',
                    payload: reward
                })
            })
            .then(() => console.log('redeemed'));
        },
        [session, state]
    );

    const refresh = useCallback(
        async () => {
            // if (!session) return Promise.reject('user not logged in');
            
            const hasNewData = await refreshUserData();
            if (hasNewData) {
                // update state
                const newData = await fetchUserData();
                dispatch({
                    type: 'SET_DATA',
                    payload: newData
                })
            }
        },
        [session, state]
    );

    return (
        <GlobalContext.Provider value={{
            session,
            userData: state,
            username,
            email,
            mobile,
            setUsername,
            setEmail,
            setMobile,
            redeemReward,
            refresh,
            dispatch,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}