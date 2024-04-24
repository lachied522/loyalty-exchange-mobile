import { useState, useEffect, useCallback } from 'react';
import { Modal, SafeAreaView, View } from "react-native";

import { X } from 'lucide-react-native';

import { Button } from '~/components/ui/button';
import { H1, H2, H3, Large } from "~/components/ui/typography";

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
            <View className='flex flex-1 flex-col items-center justify-center gap-12 p-6 relative'>
                <Button className='absolute right-6 top-12' onPress={onClose}>
                    <X size={48} color='black' />
                </Button>

                <H1>My Rewards</H1>
                
            </View>
        </Modal>
    )
}