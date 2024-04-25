import { Modal, SafeAreaView, View } from "react-native";

import { X } from 'lucide-react-native';

import { Button } from '~/components/ui/button';
import { H1 } from "~/components/ui/typography";
import RewardsList from './components/rewards-list';

interface MyRewardProps {
    onClose: () => void
}

export default function MyRewards({ onClose }: MyRewardProps) {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1, marginBottom: 36 }}>
                <View className='flex flex-col items-center gap-12'>
                    <View className='w-full flex items-start justify-start mt-10'>
                        <H1 className='ml-10'>My Rewards</H1>

                        <Button className='absolute right-0' onPress={onClose}>
                            <X size={48} color='black' />
                        </Button>
                    </View>

                    <RewardsList />
                </View>
            </SafeAreaView>
        </Modal>
    )
}