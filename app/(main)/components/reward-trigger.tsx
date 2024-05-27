import { useState, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

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

import type { Reward } from '@/types/helpers';

import { useMainContext, type MainState } from '../context/MainContext';

import RewardModal from "./reward-modal";

function handleError(error: Error, toast: ReturnType<typeof useToast>) {
    if (error.message === 'Not enough points') {
      toast.show(
        "You don't have enough points for this reward.",
        {
            placement: 'top',
            duration: 5000
        }
      )
    } else {
      toast.show(
        'Something went wrong. Please try again later.',
        {
            placement: 'top',
            duration: 5000
        }
      )
    }
}

interface RewardProps {
    rewardData: Reward
}

export default function RewardTrigger({ rewardData }: RewardProps) {
    const { userData, redeemRewardAndUpdateState } = useMainContext() as MainState;
    const [isOpen, setIsOpen] = useState<boolean>(false); // render reward modal only once use has confirmed
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toast = useToast();

    const userPoints = useMemo(() => {
        // number of points user has at this store
        return userData.points.find((obj) => obj.store_id===rewardData.store_id)?.balance || 0;
    }, [userData.points]);

    const onRedeem = async () => {
        setIsLoading(true);
        
        await redeemRewardAndUpdateState(rewardData)
        .then(() => {
            setIsOpen(true);
        })
        .catch((e) => {
            handleError(e, toast);
        });
        
        setIsLoading(false);
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
            {isOpen && <RewardModal rewardData={rewardData} onClose={() => setIsOpen(false)} />}

            {userPoints >= rewardData.cost? (
                <>
                {isLoading ? (
                    <Button disabled={true} className='bg-neutral-200'>
                        <Text className='text-black'>Pease wait...</Text>
                    </Button>
                ) : (
                    <Button onPress={onPress} className='bg-yellow-400'>
                        <Text className='text-black'>{rewardData.cost.toLocaleString()} points</Text>
                    </Button>
                )}
                </>
            ) : (
                <Button disabled className='bg-transparent border border-neutral-300'>
                    <Text className='text-black'>{rewardData.cost.toLocaleString()} points</Text>
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