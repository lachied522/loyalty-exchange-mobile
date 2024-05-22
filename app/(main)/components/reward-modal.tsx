import { useState, useEffect } from 'react';
import { Modal, View, Pressable, Alert } from "react-native";

import { Progress } from '~/components/ui/progress';
import { H1, H3, H4, Small } from "~/components/ui/typography";

import Logo from '~/components/Logo';

import { useMainContext, type MainState } from '../context/MainContext';

import Coupon from './coupon';
import StoreLogo from './store-logo';
import RewardImage from './reward-image';

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

    useEffect(() => {
         if (timeElapsed > maxTime) {
            // clear intervals and close model
            onClose();
         }
    }, [timeElapsed]);

    useEffect(() => {
        if (rewardData.reward_type === 'promo_code') return; // promo codes have no time limit

        const countdownID = setInterval(() => setTimeElapsed((curr) => curr + 1), 1000);
        // close modal after 30 seconds

        return () => {
            clearTimeout(countdownID);
        }
    }, [setTimeElapsed]);

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
            <Pressable onPress={onPress} className='flex flex-1 items-center justify-center bg-neutral-800/90'>
                <Coupon>
                    <Pressable onPress={(e) => e.stopPropagation()} className='w-full flex flex-col items-center'>
                        <View className='h-full flex flex-col items-center justify-between py-16'>
                            <View className='flex flex-col items-center gap-1'>
                                <Logo />

                                <StoreLogo
                                    url={storeData[rewardData.store_id]?.store_logo_url ?? null}
                                    height={90}
                                />
                            </View>

                            <View className='flex flex-col items-center gap-5'>
                                <View className='flex flex-col items-center gap-1 px-6'>
                                    <H3>{rewardData.title} @</H3>
                                    <H3>{storeData[rewardData.store_id]!.name}</H3>
                                </View>

                                {rewardData.reward_type === 'promo_code'? (
                                <>
                                    <H4>Your Promo Code is</H4>

                                    <View className='min-w-[180px] flex items-center justify-center border border-dashed p-6'>
                                        <H1>{rewardData.promo_code!}</H1>
                                    </View>

                                    <Small className='max-w-[240px] text-center'>
                                        Use this code when you make your purchase.
                                    </Small>
                                </>
                                ) : (
                                <>
                                    <RewardImage
                                        url={rewardData.image_url}
                                        width={180}
                                        height={120}
                                        rounded={false}
                                    />

                                    <Small className='max-w-[240px] text-center'>
                                        Present this at the register when you make your purchase.
                                    </Small>
                                </>
                                )}
                            </View>

                            <View className='flex flex-col items-center gap-6'>
                                {rewardData.reward_type !== 'promo_code' && (
                                <View className='flex flex-col items-center gap-3'>
                                    <H4>Time remaining {maxTime - timeElapsed}s</H4>

                                    <Progress value={100 * timeElapsed / maxTime} className='w-[200px] bg-black border border-black' />
                                </View>
                                )}

                                <Small>Tap outside to close</Small>
                            </View>
                        </View>
                    </Pressable>
                </Coupon>
            </Pressable>
        </Modal>
    )
}