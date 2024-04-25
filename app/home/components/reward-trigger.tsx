import { useState } from 'react';
import { View, Alert } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

import { useGlobalContext, type GlobalState } from '@/context/GlobalContext';

import RewardModal from "./reward-modal";

import type { Reward } from '@/types/helpers';

interface RewardProps {
    rewardData: Reward
}

export default function RewardTrigger({ rewardData }: RewardProps) {
    const { redeemReward } = useGlobalContext() as GlobalState;
    const [isOpen, setIsOpen] = useState<boolean>(false); // render reward modal only once use has confirmed
    const [isDisabled, setIsDisabled] = useState<boolean>(false); // disable open button after first click

    const onRedeem = async () => {
        setIsDisabled(true);
        await redeemReward(rewardData)
        .then(() => setIsOpen(true))
        .finally(() => setIsDisabled(false));
    }

    const onPress = () => {
        Alert.alert('Are you sure?', 'This reward can only be opened once', [
            {
                text: 'Cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    onRedeem();
                },
            }
        ])
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isOpen && <RewardModal rewardData={rewardData} />}
            
            {rewardData.redeemed ? (
                <Button disabled={isDisabled} className='bg-slate-200'>
                    <Text>Redeemed</Text>
                </Button>
            ) : (
                <Button onPress={onPress} disabled={isDisabled} className='bg-slate-200'>
                    <Text>Redeem</Text>
                </Button>
            )}
        </View>
    )
}