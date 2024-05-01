import { useState, useEffect } from 'react';
import { Modal, View } from "react-native";

import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { H1, H2, H3, Large } from "~/components/ui/typography";
import { X } from '~/components/Icons';
import { shadowStyles } from '~/constants/constants';

import { useMainContext, type MainState } from '../context/MainContext';

import type { Reward } from '@/types/helpers';

interface RewardProps {
    rewardData: Reward
}

const MAX_TIME = 60;
export default function RewardModal({ rewardData }: RewardProps) {
    const { storeData, dispatch } = useMainContext() as MainState;
    const [isVisible, setIsVisible] = useState<boolean>(true); // default to open
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
         if (timeElapsed > MAX_TIME) {
            // clear intervals and close model
            setIsVisible(false);
            // update state
            dispatch({
                type: 'REDEEM_REWARD',
                payload: rewardData
            })
         }
    }, [timeElapsed]);

    useEffect(() => {
        const countdownID = setInterval(() => setTimeElapsed((curr) => curr + 1), 1000);
        // close modal after 30 seconds

        return () => {
            clearTimeout(countdownID);
        }
    }, [isVisible, setTimeElapsed]);

    useEffect(() => {
        if (!isVisible) return;
        // update current time
        const timerID = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
          clearInterval(timerID);
        };
    }, [isVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
        >
            <View className='flex flex-1 items-center justify-end bg-gray-400/60'>

                <View className='w-full flex flex-col items-center'>
                    <View className='w-full h-[80vh] flex flex-col items-center justify-center bg-yellow-200 border-t relative' style={shadowStyles.dashed}>
                        <View className='w-full flex-row justify-end absolute top-6 right-0'>
                            <Button className='' onPress={() => setIsVisible(false)}>
                                <X size={48} color='black' />
                            </Button>
                        </View>

                        <View className='w-full flex items-center gap-24 mb-24'>
                                <View className='flex flex-col items-center'>
                                    <H3>Loyalty Exchange</H3>
                                    <H3>x</H3>
                                    <H3>{storeData[rewardData.store_id].name}</H3>
                                </View>

                            <H1>
                                {rewardData.title}
                            </H1>

                            <View className='flex flex-col gap-6'>
                                <H3>Time remaining {MAX_TIME - timeElapsed}s</H3>

                                <Progress value={100 * timeElapsed / MAX_TIME} className='w-[200px] bg-black border border-black' />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}