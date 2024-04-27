import { useState, useEffect, createContext, useContext, useCallback, useReducer } from "react";

import type { Session } from "@supabase/supabase-js";

import { GlobalReducer, type Action } from "./GlobalReducer";

import { refreshUserData, setRewardRedeemed, convertToStorePoints } from "@/utils/functions";

import { fetchUserData, type UserData, type StoreData } from "@/utils/crud";
import type { Reward } from "@/types/helpers";

const GlobalContext = createContext<any>(null);

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export type GlobalState = {
    session: Session | null
    userData: UserData
    storeData: { [store_id: string]: StoreData }
    username: string
    email: string
    mobile: string
    setUsername: React.Dispatch<React.SetStateAction<string>>
    setEmail: React.Dispatch<React.SetStateAction<string>>
    setMobile: React.Dispatch<React.SetStateAction<string>>
    dispatch: React.Dispatch<Action>
    refresh: () => Promise<void>
    redeemReward: (reward: Reward) => Promise<void>
    convertPoints: (amount: number, rate: number, store_id: string) => Promise<void>
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
    // store data for each store that user has points for
    const [storeData, setStoreData] = useState<{ [store_id: string]: StoreData }>(
        initialState.points.reduce((acc, obj) => ({ ...acc, [obj.store_id]: obj.stores}), {})
    );
    const [username, setUsername] = useState('testUser');
    const [email, setEmail] = useState('test@test.com'); // TODO: remove defaults!!!
    const [mobile, setMobile] = useState('0400527849');

    const refresh = useCallback(
        async () => {
            // if (!session) return Promise.reject('user not logged in');
            
            return await refreshUserData()
            .then((hasNewData) => {
                if (hasNewData) {
                    // update state
                    fetchUserData()
                    .then((newData) => {
                        dispatch({
                            type: 'SET_DATA',
                            payload: newData
                        })
                    });
                }
            });
        },
        [session, state]
    );

    const redeemReward = useCallback(
        async (reward: Reward) => {
            // if (!session) return Promise.reject('user not logged in');
            
            return await setRewardRedeemed(reward, state);
        },
        [session, state]
    );

    const convertPoints = useCallback(
        async (amount: number, rate: number, store_id: string) => {
            console.log(amount);
            const newPointsBalance = state.points_balance - amount;
            const storePointsBalance = state.points.find((obj) => obj.store_id===store_id)?.balance || 0;

            const newStorePointsBalance = amount * rate + storePointsBalance;

            console.log('user', newPointsBalance);
            console.log('store', newStorePointsBalance);

            return await convertToStorePoints(newPointsBalance, newStorePointsBalance, store_id)
            .then((success) => {
                if (success) {
                    // update state
                    dispatch({
                        type: 'SET_STORE_POINTS',
                        payload: {
                            value: storePointsBalance,
                            store_id,
                        }
                    });

                    dispatch({
                        type: 'SET_EXCHANGE_POINTS',
                        payload: {
                            value: newPointsBalance,
                        }
                    });
                }
            });
        },
        []
    )

    return (
        <GlobalContext.Provider value={{
            session,
            userData: state,
            storeData,
            username,
            email,
            mobile,
            setUsername,
            setEmail,
            setMobile,
            refresh,
            redeemReward,
            convertPoints,
            dispatch,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}