import { useState } from 'react';
import { View, Alert } from 'react-native';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

import type { Tables } from '@/types/supabase';

import { useMainContext, type MainState } from '../context/MainContext';

import RewardModal from "./reward-modal";

interface RewardProps {
    rewardData: Tables<'reward_types'>
}

export default function RewardTrigger({ rewardData }: RewardProps) {
    const { redeemReward } = useMainContext() as MainState;
    const [isOpen, setIsOpen] = useState<boolean>(false); // render reward modal only once use has confirmed
    const [isRedeemed, setIsRedeemed] = useState<boolean>(false); // disable open button after first click

    const onRedeem = async () => {
        setIsRedeemed(true);
        setIsOpen(true);
        return await redeemReward(rewardData)
        .then(() => setIsOpen(true))
        .catch(() => setIsRedeemed(false));
    }

    const onPress = () => {
        Alert.alert(
            'Are you sure?',
            'This reward can only be opened once. Make sure you are ready to present this reward.',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        onRedeem();
                    },
                }
            ]
        )
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {isOpen && <RewardModal rewardData={rewardData} />}

            {isRedeemed ? (
                <Button disabled={isRedeemed} className='bg-slate-100'>
                    <Text>Redeemed</Text>
                </Button>
            ) : (
                <Button onPress={onPress} disabled={isRedeemed} className='bg-yellow-400'>
                    <Text>Redeem</Text>
                </Button>
            )}
        </View>
    )
}

function AlertDialog({ children, onPress }: {
    children: React.ReactNode,
    onPress: () => void
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className='round-full m-2'>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure?
                    </DialogTitle>
                    <DialogDescription>
                        This reward can only be opened once. Make sure you are ready to redeem this reward now.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex flex-row items-center justify-between'>
                    <DialogClose asChild>
                        <Button className='w-[80px] border border-slate-200'>
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onPress={onPress} className='border border-slate-200'>
                            <Text>Redeem</Text>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}