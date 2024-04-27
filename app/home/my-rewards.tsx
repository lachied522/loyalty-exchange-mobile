import { Modal, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from '~/components/ui/button';
import { H1, Large } from "~/components/ui/typography";
import { X } from '~/components/Icons';

import { useMainContext, type MainState } from "./context/MainContext";

import RewardsList from './components/rewards-list';
import RedeemedTable from './components/redeemed-table';

export default function MyRewards() {
    const { setMyRewardsIsOpen } = useMainContext() as MainState;

    const insets = useSafeAreaInsets();

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={() => setMyRewardsIsOpen(false)}
        >
            <View className='h-full flex flex-col bg-slate-100'>
                <View className='h-[120px] w-full flex flex-row items-center justify-between bg-white px-6 pb-6' style={{ paddingTop: insets.top }}>
                    <H1>My Rewards</H1>

                    <View className='w-12 h-12 flex items-center justify-center'>
                        <Button onPress={() => setMyRewardsIsOpen(false)}>
                            <X size={30} color='rgb(15 23 42)' />
                        </Button>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16, gap: 12 }}
                    keyboardShouldPersistTaps='handled'
                >
                    <View className='gap-4'>
                        <Large>Available Rewards</Large>

                        <RewardsList />
                    </View>

                    <View className='gap-4'>
                        <Large>Recently Redeemed</Large>

                        <RedeemedTable />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}