import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { Alert } from 'react-native';

import { useCustomToast } from '~/app/hooks/useCustomToast';

import { useMainContext, type MainState } from '../context/MainContext';

import type { Reward } from '~/app/types/helpers';

const DEFAULT_MAX_TIME = 60; // default time reward will be visible before closing (s)

const RewardModalContext = createContext<{
    data: Reward | null,
    isRewardOpen: boolean,
    isRewardLoading: boolean,
    timeRemaing: number,
    maxTimeOpen: number,
    onOpenReward: (rewardData: Reward, maxTime?: number) => void,
    onCloseReward: () => void,
}>({
    data: null,
    isRewardOpen: false,
    isRewardLoading: false,
    timeRemaing: DEFAULT_MAX_TIME,
    maxTimeOpen: DEFAULT_MAX_TIME,
    onOpenReward: () => {},
    onCloseReward: () => {},
});

export const useRewardModal = () => {
    return useContext(RewardModalContext);
}

function handleError(error: Error, toast: ReturnType<typeof useCustomToast>) {
    if (error.message === 'Not enough points') {
      toast.show("You don't have enough points for this reward.");
    } else {
      toast.show('Something went wrong. Please try again later.');
    }
}

interface RewardModalProviderProps {
    children: React.ReactNode
}

export default function RewardModalProvider({ children }: RewardModalProviderProps) {
    const { redeemRewardAndUpdateState } = useMainContext() as MainState;
    const [data, setData] = useState<Reward | null>(null); // data for reward that is currently open
    const [isRewardOpen, setIsRewardOpen] = useState<boolean>(false); // whether reward modal is visible
    const [isRewardLoading, setIsRewardLoading] = useState<boolean>(false); // indicates reward is awaiting redemption
    const [maxTimeOpen, setMaxTimeOpen] = useState<number>(DEFAULT_MAX_TIME); // maximum time to display reward
    const [timeRemaing, setTimeRemaining] = useState<number>(DEFAULT_MAX_TIME); // time remaining for current reward
    const [timeOpened, setTimeOpened] = useState<Date>(new Date()); // time that current reward was opened
    const toast = useCustomToast();

    useEffect(() => {
        if (timeRemaing < 0) {
            // clear intervals and close model
            onCloseReward();
        }
    }, [timeRemaing]);

    useEffect(() => {
        if (!(isRewardOpen && data)) return;
        if (data.reward_type === 'promo_code') return; // promo codes have no time limit
        
        // create interval for setting time remaining
        const countdownID = setInterval(() => {
            const now = new Date();
            setTimeRemaining(
                Math.round(maxTimeOpen - (now.getTime() - timeOpened.getTime()) / 1000)
            )
        }, 1000);

        return () => {
            clearTimeout(countdownID);
        }
    }, [isRewardOpen, data, setTimeRemaining]);

    const onRedeem = async (rewardData: Reward, maxTime: number = DEFAULT_MAX_TIME) => {
        setData(rewardData);
        setIsRewardLoading(true);
        setTimeOpened(new Date());
        setMaxTimeOpen(maxTime);
        setTimeRemaining(maxTime);

        await redeemRewardAndUpdateState(rewardData)
        .then(() => {
            console.log('redeemed');
            setIsRewardOpen(true);
        })
        .catch((e) => {
            console.log(e);
            handleError(e, toast);
        });
        
        setIsRewardLoading(false);
    }

    const onOpenReward = (rewardData: Reward, maxTime?: number) => {
        // render reward modal only once use has confirmed
        Alert.alert(
            'Are you sure?',
            'This reward can only be opened once. Make sure you are ready to present this reward.',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'OK',
                    onPress: () => onRedeem(rewardData, maxTime),
                }
            ]
        )
    }

    const onCloseReward = () => {
        setIsRewardOpen(false);
        setData(null);
    }

    return (
        <RewardModalContext.Provider value={{
            data,
            isRewardOpen,
            isRewardLoading,
            timeRemaing,
            maxTimeOpen,
            onOpenReward,
            onCloseReward,
        }}>
            {children}
        </RewardModalContext.Provider>
    )
}