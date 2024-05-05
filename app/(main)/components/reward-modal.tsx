import { useState, useEffect } from 'react';
import { Modal, View, Pressable, Alert } from "react-native";

import { Progress } from '~/components/ui/progress';
import { H1, H2, H3, Large, Small } from "~/components/ui/typography";
import { X, Icon } from "~/components/Icons";

import Logo from '~/components/Logo';

import { useMainContext, type MainState } from '../context/MainContext';

import Coupon from './coupon';
import StoreLogo from './store-logo';

import type { Reward } from '@/types/helpers';

interface RewardProps {
    rewardData: Reward
    onClose: () => void // close modal
    maxTime?: number
}

export default function RewardModal({
    rewardData,
    onClose,
    maxTime = 60
}: RewardProps) {
    const { storeData, dispatch } = useMainContext() as MainState;
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
         if (timeElapsed > maxTime) {
            // clear intervals and close model
            onClose();
         }
    }, [timeElapsed]);

    useEffect(() => {
        const countdownID = setInterval(() => setTimeElapsed((curr) => curr + 1), 1000);
        // close modal after 30 seconds

        return () => {
            clearTimeout(countdownID);
        }
    }, [setTimeElapsed]);

    useEffect(() => {
        // update current time
        const timerID = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
          clearInterval(timerID);
        };
    }, []);

    const onPress = () => {
        Alert.alert(
            'Would you like to close this reward?',
            'You will not be able to open it again.',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        onClose();
                    },
                }
            ]
        )
    }

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <Pressable onPress={onPress} className='flex flex-1 items-center justify-center bg-neutral-200/80'>
                <Coupon>
                    <Pressable onPress={(e) => e.stopPropagation()} className='w-full flex flex-col items-center'>
                        <View className='h-full flex-col items-center justify-between py-16'>
                            <View className='flex flex-col items-center'>
                                <Logo />
                                <StoreLogo />
                            </View>

                            <View className='flex flex-col items-center gap-2 mb-12'>
                                <Icon name='Coffee' size={56} color='black' />
                                <H1>{rewardData.title}</H1>
                            </View>

                            <View className='flex flex-col items-center gap-6'>
                                <H3>Time remaining {maxTime - timeElapsed}s</H3>

                                <Progress value={100 * timeElapsed / maxTime} className='w-[200px] bg-black border border-black' />

                                <Small>Tap outside to close</Small>
                            </View>
                        </View>
                    </Pressable>
                </Coupon>
            </Pressable>
        </Modal>
    )
}