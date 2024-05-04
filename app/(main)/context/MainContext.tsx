import { useState, createContext, useContext, useCallback, useReducer } from "react";

import { MainReducer, type Action } from "./MainReducer";

import { fetchUserData, refreshUserData, redeemReward } from "@/utils/functions";

import type { Session } from "@supabase/supabase-js";
import type { UserData, StoreData, Reward } from "@/types/helpers";

const MainContext = createContext<any>(null);

export const useMainContext = () => {
    return useContext(MainContext);
}

export type MainState = {
    session: Session | null
    userData: UserData
    storeData: { [store_id: string]: StoreData }
    myRewardsIsOpen: boolean,
    dispatch: React.Dispatch<Action>
    refreshUserDataAndUpdateState: () => Promise<void>
    redeemRewardAndUpdateState: (reward: Reward) => Promise<void>
    setStoreData: React.Dispatch<{ [store_id: string]: StoreData }>
    setMyRewardsIsOpen: React.Dispatch<React.SetStateAction<boolean>>
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
    const [storeData, setStoreData] = useState<{ [store_id: string]: StoreData }>(
        initialState.points.reduce((acc, obj) => ({ ...acc, [obj.store_id]: obj.stores }), {})
    );
    const [myRewardsIsOpen, setMyRewardsIsOpen] = useState<boolean>(false); // controls whether the My Rewards modal is open

    const refreshUserDataAndUpdateState = useCallback(
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

    const redeemRewardAndUpdateState = useCallback(
        async (reward: Reward) => {
            // ensure user has enough points
            const points = state.points.find((obj) => obj.store_id === reward.store_id)?.balance || 0;

            if (points < reward.cost) {
                throw new Error('Not enough points');
            };

            const isRedeemed = await redeemReward(reward);

            if (!isRedeemed) {
                throw new Error('Error redeeming reward');
            }
            
            // update store points
            dispatch({
                type: 'SET_STORE_POINTS',
                payload: {
                    store_id: reward.store_id,
                    value: points - reward.cost,
                }
            });

            // add reward to state
            dispatch({
                type: 'INSERT_REWARD',
                payload: {
                    id: '',
                    redeemed_at: new Date().toISOString(),
                    reward_id: reward.id,
                    user_id: state.id,
                    reward_types: reward,
                }
            });

            return true;
        },
        [state]
    );

    return (
        <MainContext.Provider value={{
            userData: state,
            storeData,
            myRewardsIsOpen,
            dispatch,
            refreshUserDataAndUpdateState,
            redeemRewardAndUpdateState,
            setStoreData,
            setMyRewardsIsOpen,
        }}>
            {children}
        </MainContext.Provider>
    )
}