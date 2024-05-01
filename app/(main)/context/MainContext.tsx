import { useState, useEffect, createContext, useContext, useCallback, useReducer } from "react";

import type { Session } from "@supabase/supabase-js";

import { MainReducer, type Action } from "./MainReducer";

import { setRewardRedeemed, convertToStorePoints } from "@/utils/functions";
import { refreshUserData } from "@/utils/fetching";

import { fetchUserData, type UserData, type StoreData } from "@/utils/crud";
import type { Reward } from "@/types/helpers";

const MainContext = createContext<any>(null);

export const useMainContext = () => {
    return useContext(MainContext);
}

export type MainState = {
    session: Session | null
    userData: UserData
    storeData: { [store_id: string]: StoreData }
    myRewardsIsOpen: boolean,
    pointsExchangeIsOpen: boolean,
    dispatch: React.Dispatch<Action>
    refresh: () => Promise<void>
    redeemReward: (reward: Reward) => Promise<void>
    convertPoints: (amount: number, rate: number, store_id: string) => Promise<void>
    setMyRewardsIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setPointsExchangeIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface MainContextProps {
    initialState: UserData,
    children: React.ReactNode
}

export default function MainContextProvider({
    initialState,
    children
}: MainContextProps) {
    const [state, dispatch] = useReducer<typeof MainReducer>(MainReducer, initialState);
    // store data for each store that user has points for
    const [storeData, setStoreData] = useState<{ [store_id: string]: StoreData }>(
        initialState.points.reduce((acc, obj) => ({ ...acc, [obj.store_id]: obj.stores }), {})
    );
    const [myRewardsIsOpen, setMyRewardsIsOpen] = useState<boolean>(false); // controls whether the My Rewards modal is open
    const [pointsExchangeIsOpen, setPointsExchangeIsOpen] = useState<boolean>(false); // controls whether the Points Exchange modal is open

    const refresh = useCallback(
        async () => {
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
        [state]
    );

    const redeemReward = useCallback(
        async (reward: Reward) => {
            // if (!session) return Promise.reject('user not logged in');

            return await setRewardRedeemed(reward, state);
        },
        [state]
    );

    const convertPoints = useCallback(
        async (amount: number, rate: number, store_id: string) => {
            const newPointsBalance = state.points_balance - amount;
            const storePointsBalance = state.points.find((obj) => obj.store_id===store_id)?.balance || 0;

            const newStorePointsBalance = amount * rate + storePointsBalance;

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
        <MainContext.Provider value={{
            userData: state,
            storeData,
            myRewardsIsOpen,
            pointsExchangeIsOpen,
            dispatch,
            refresh,
            redeemReward,
            convertPoints,
            setMyRewardsIsOpen,
            setPointsExchangeIsOpen,
        }}>
            {children}
        </MainContext.Provider>
    )
}