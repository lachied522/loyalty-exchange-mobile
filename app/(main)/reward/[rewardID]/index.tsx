import { useMemo } from 'react';
import { useLocalSearchParams } from "expo-router";

import { type MainState, useMainContext } from "~/app/(main)/context/MainContext";

import RewardScreen from './components/reward-screen';
import NotFoundScreen from '~/app/+not-found';

export default function RewardIDIndex() {
    const { storeDataMap } = useMainContext() as MainState;
    const { rewardID } = useLocalSearchParams() as { rewardID: string };
    
    const data = useMemo(() => {
        for (const store of Object.values(storeDataMap)) {
            for (const reward of store.rewards) {
                if (reward.id === rewardID) return reward;
            }
        }
    }, [storeDataMap]);

    return (
        <>
            {data? (
            <RewardScreen rewardData={data} />
            ): (
            <NotFoundScreen />
            )}
        </>
    )
}