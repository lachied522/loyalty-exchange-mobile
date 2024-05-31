import { useState, useEffect } from 'react';
import { Modal, View, Pressable, Alert, useWindowDimensions } from "react-native";

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
    const { storeDataMap } = useMainContext() as MainState;
    const [timeRemaing, setTimeRemaining] = useState<number>(maxTime);
    const [timeOpened, setTimeOpened] = useState<Date>(new Date());
    const { height: screenHeight } = useWindowDimensions();

    useEffect(() => {
        if (timeRemaing < 0) {
            // clear intervals and close model
            onClose();
        }
    }, [timeRemaing]);

    useEffect(() => {
        if (rewardData.reward_type === 'promo_code') return; // promo codes have no time limit

        const countdownID = setInterval(() => {
            const now = new Date();
            setTimeRemaining(
                Math.round(maxTime - (now.getTime() - timeOpened.getTime()) / 1000)
            )
        }, 1000);

        return () => {
            clearTimeout(countdownID);
        }
    }, [setTimeRemaining]);

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
                        <View className='h-full flex flex-col items-center justify-between py-12 gap-3.5'>
                            <View className='flex flex-col items-center gap-1'>
                                <Logo />

                                <StoreLogo
                                    url={storeDataMap[rewardData.store_id]?.store_logo_url ?? null}
                                    width={240}
                                    height={screenHeight > 1024? 120: 90}
                                    contentFit='contain'
                                />
                            </View>

                            <View className='flex flex-col items-center gap-5'>
                                <View className='flex flex-col items-center gap-1 px-6'>
                                    <H3 className='max-w-[240px] text-center'>
                                        {rewardData.title.slice(0, 60)} @
                                    </H3>
                                    <H3 className='max-w-[240px] text-center'>
                                        {storeDataMap[rewardData.store_id]!.name}
                                        {rewardData.conditions? '*': ''}
                                    </H3>
                                    {rewardData.conditions && (
                                    <Small>*{rewardData.conditions}</Small>
                                    )}
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
                                        url={rewardData.image_url || storeDataMap[rewardData.store_id]?.store_logo_url}
                                        width={240}
                                        height={screenHeight > 1024? 160: 120}
                                        rounded={false}
                                        contentFit='contain'
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
                                    <H4>Time remaining {timeRemaing}s</H4>

                                    <Progress value={100 * (maxTime - timeRemaing) / maxTime} className='w-[200px] bg-black border border-black' />
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