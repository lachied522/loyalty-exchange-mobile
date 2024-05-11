import { Modal, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from '~/components/ui/button';
import { H3 } from "~/components/ui/typography";
import { X } from '~/components/Icons';

import { useMainContext, type MainState } from "../../context/MainContext";

import AvailableRewards from './components/available-rewards';
import RecentlyRedeemed from './components/recently-redeemed';

export default function RewardsScreen() {
    const { setMyRewardsIsOpen } = useMainContext() as MainState;

    const insets = useSafeAreaInsets();

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={() => setMyRewardsIsOpen(false)}
        >
            <View className='h-full flex flex-col bg-white'>
                <View className='h-[120px] w-full flex flex-row items-center justify-between bg-white p-3' style={{ paddingTop: insets.top }}>
                    <H3>My Rewards</H3>

                    <View className='w-12 h-12 flex items-center justify-center'>
                        <Button onPress={() => setMyRewardsIsOpen(false)}>
                            <X size={30} color='rgb(15 23 42)' />
                        </Button>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{ gap: 12, backgroundColor: 'rgb(245 245 245)' }}
                    keyboardShouldPersistTaps='handled'
                >
                    <AvailableRewards />

                    <RecentlyRedeemed />
                </ScrollView>
            </View>
        </Modal>
    )
}