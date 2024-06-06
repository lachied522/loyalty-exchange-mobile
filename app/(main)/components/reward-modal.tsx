import { Modal, View, Pressable, Alert, useWindowDimensions } from "react-native";

import { Progress } from '~/components/ui/progress';
import { H1, H3, H4, Small } from "~/components/ui/typography";

import Logo from '~/components/Logo';

import { useMainContext, type MainState } from '../context/MainContext';
import { useRewardModal } from "../context/RewardModalContext";

import Coupon from './coupon';
import StoreLogo from './store-logo';
import RewardImage from './reward-image';

export default function RewardModal() {
    const { storeDataMap } = useMainContext() as MainState;
    const { data, isRewardOpen, timeRemaing, maxTimeOpen, onCloseReward } = useRewardModal();
    const { height: screenHeight } = useWindowDimensions();

    const onTapOutside = () => {
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
                        onCloseReward();
                    },
                }
            ]
        )
    }
    
    if (!(data && isRewardOpen)) return null;

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={onCloseReward}
        >
            <Pressable onPress={onTapOutside} className='flex flex-1 items-center justify-center bg-neutral-800/90'>
                <Coupon>
                    <Pressable onPress={(e) => e.stopPropagation()} className='w-full flex flex-col items-center'>
                        <View className='h-full flex flex-col items-center justify-between py-12 gap-3.5'>
                            <View className='flex flex-col items-center gap-1'>
                                <Logo />

                                <StoreLogo
                                    url={storeDataMap[data.store_id]?.store_logo_url ?? null}
                                    width={240}
                                    height={screenHeight > 1024? 120: 90}
                                    contentFit='contain'
                                />
                            </View>

                            <View className='flex flex-col items-center gap-5'>
                                <View className='flex flex-col items-center gap-1 px-6'>
                                    <H3 className='max-w-[240px] text-center'>
                                        {data.title.slice(0, 60)} @
                                    </H3>
                                    <H3 className='max-w-[240px] text-center'>
                                        {storeDataMap[data.store_id]!.name}
                                        {data.conditions? '*': ''}
                                    </H3>
                                    {data.conditions && (
                                    <Small>*{data.conditions}</Small>
                                    )}
                                </View>

                                {data.reward_type === 'promo_code'? (
                                <>
                                    <H4>Your Promo Code is</H4>

                                    <View className='min-w-[180px] flex items-center justify-center border border-dashed p-6'>
                                        <H1>{data.promo_code!}</H1>
                                    </View>

                                    <Small className='max-w-[240px] text-center'>
                                        Use this code when you make your purchase.
                                    </Small>
                                </>
                                ) : (
                                <>
                                    <RewardImage
                                        url={data.image_url || storeDataMap[data.store_id]?.store_logo_url}
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
                                {data.reward_type !== 'promo_code' && (
                                <View className='flex flex-col items-center gap-3'>
                                    <H4>Time remaining {timeRemaing}s</H4>

                                    <Progress value={100 * (maxTimeOpen - timeRemaing) / maxTimeOpen} className='w-[200px] bg-black border border-black' />
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