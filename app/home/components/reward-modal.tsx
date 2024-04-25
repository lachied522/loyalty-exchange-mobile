import { useState, useEffect, useCallback } from 'react';
import { Modal, SafeAreaView, View } from "react-native";

import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { H1, H2, H3, Large } from "~/components/ui/typography";

import { X } from '~/components/Icons';

import type { Reward } from '@/types/helpers';

interface RewardProps {
    rewardData: Reward
}

const MAX_TIME = 30;

export default function RewardModal({ rewardData }: RewardProps) {
    const [isVisible, setIsVisible] = useState<boolean>(true); // default to open
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
         if (timeElapsed > MAX_TIME) {
            // clear intervals and close model
            setIsVisible(false);
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
            <View className='flex flex-1 flex-col items-center justify-center bg-yellow-400 gap-12 relative'>
                <Button className='absolute right-0 top-12' onPress={() => setIsVisible(false)}>
                    <X size={48} color='black' />
                </Button>

                <View className='w-full flex items-center gap-6'>
                    <H2>Store Name</H2>

                    <Progress value={100 * timeElapsed / MAX_TIME} className='w-[200px] bg-black' />

                    <H3>{currentTime.toLocaleTimeString()}</H3>
                </View>

                <View>
                    <H1>
                        One Free Coffee
                    </H1>
                </View>
            </View>
        </Modal>
    )
}