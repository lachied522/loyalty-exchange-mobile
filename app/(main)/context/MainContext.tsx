import { useState, createContext, useContext, useCallback, useReducer } from "react";

import { refreshUserData, redeemReward } from "@/utils/functions";

import { MainReducer, type Action } from "./MainReducer";

import type { Session } from "@supabase/supabase-js";
import type { UserData, StoreData, Reward } from "@/types/helpers";

const REFRESH_LIMIT = 5 * 60 * 1000; // five minutes

const MainContext = createContext<any>(null);

export const useMainContext = () => {
    return useContext(MainContext);
}

export type MainState = {
    session: Session | null
    userData: UserData
    storeDataMap: { [store_id: string]: StoreData }
    myRewardsIsOpen: boolean,
    dispatch: React.Dispatch<Action>
    refreshUserDataAndUpdateState: () => Promise<void>
    redeemRewardAndUpdateState: (reward: Reward) => Promise<void>
    setStoreDataMap: React.Dispatch<React.SetStateAction<{ [store_id: string]: StoreData }>>
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
    const [storeDataMap, setStoreDataMap] = useState<{ [store_id: string]: StoreData }>(
        initialState.points?.reduce((acc, obj) => ({ ...acc, [obj.store_id]: obj.stores }), {}) || {}
    );
    const [myRewardsIsOpen, setMyRewardsIsOpen] = useState<boolean>(false); // controls whether the My Rewards modal is open
    const [lastRefresh, setLastRefresh] = useState<number | null>(null); // time of last refresh request

    const refreshUserDataAndUpdateState = useCallback(
        async () => {
            // limit calls of this to 1 every 5 mins
            if (lastRefresh) {
                const now = new Date();
                if (now.getTime() - lastRefresh < REFRESH_LIMIT) {
                    return;
                }
            }

            // update last refresh
            setLastRefresh(new Date().getTime());
            
            return await refreshUserData()
            .then(({ data }) => {
                if (data) {
                    // update state
                    dispatch({
                        type: 'SET_DATA',
                        payload: data
                    })
                }
            })
            .catch(() => {});
        },
        [lastRefresh, setLastRefresh, dispatch]
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
                type: 'INSERT_REDEEMED',
                payload: {
                    id: '',
                    redeemed_at: new Date().toISOString(),
                    reward_id: reward.id,
                    user_id: state.id,
                    rewards: reward,
                }
            });

            return true;
        },
        [state]
    );

    return (
        <MainContext.Provider value={{
            userData: state,
            storeDataMap,
            myRewardsIsOpen,
            dispatch,
            refreshUserDataAndUpdateState,
            redeemRewardAndUpdateState,
            setStoreDataMap,
            setMyRewardsIsOpen,
        }}>
            {children}
        </MainContext.Provider>
    )
}