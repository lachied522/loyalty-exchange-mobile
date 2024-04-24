import { useState } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { Stack, usePathname } from "expo-router";

import { createBottomTabNavigator, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import Home from "./home";
import Account from "./account";
import MyRewards from "./my-rewards";
import { BadgeDollarSign, CircleUserRound, HomeIcon } from "lucide-react-native";
import { cn } from "~/lib/utils";


// couldn't get expo tabs to work, have to use react native tabs
const Tab = createBottomTabNavigator();

export default function MainLayout() {
    const { session } = useGlobalContext() as GlobalState;
    // manually control whether rewards is open, navigation is too confusing
    const [myRewardsIsOpen, setMyRewardsIsOpen] = useState<boolean>(false);

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />

            {myRewardsIsOpen && <MyRewards onClose={() => setMyRewardsIsOpen(false)} />}

            <Tab.Navigator 
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 10,
                        height: 80,
                        width: '100%',
                        display: 'flex',
                        backgroundColor: '#fffff',
                        paddingVertical: 25,
                    }
                }}
            >
                <Tab.Screen 
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className='flex flex-col items-center justify-center gap-1'>
                                <HomeIcon size={32} color={focused ? '#EAB308' : '#222'} />
                                <Text style={{ color: focused ? '#EAB308' : '#222' }}>
                                    Home
                                </Text>
                            </View>
                        )
                    }}
                />
                <Tab.Screen 
                    name="My Rewards"
                    component={Home}
                    listeners={({ navigation }) => ({
                        tabPress: (event) => {
                            // prevent default navigation
                            event.preventDefault();
                            setMyRewardsIsOpen(!myRewardsIsOpen);
                        },
                    })}
                    options={{
                        tabBarButton: (props: BottomTabBarButtonProps) => (
                            <TouchableOpacity onPress={props.onPress}>
                                <View className='z-10 flex flex-row items-center justify-center bg-yellow-400 gap-2 p-6 rounded-[25] top-[-62] shadow-md'>
                                    <BadgeDollarSign size={28} color='black' />
                                    <Text className='text-black text-xl font-semibold'>
                                        My Rewards
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Tab.Screen 
                    name="Account"
                    component={Account}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className='flex flex-col items-center justify-center gap-1'>
                                <CircleUserRound size={32} color={focused ? '#EAB308' : '#222'} />
                                <Text style={{ color: focused ? '#EAB308' : '#222' }}>
                                    Account
                                </Text>
                            </View>
                        )
                    }}
                />
            </Tab.Navigator>
        </>
        
    )
}

function CustomTabButton(props: BottomTabBarButtonProps) {
    return (
        <TouchableOpacity onPress={() => console.log('pressed')}>
            <View className='z-10 flex flex-row items-center justify-center bg-yellow-400 gap-2 p-6 rounded-[25] top-[-50] shadow-md'>
                <BadgeDollarSign size={30} color='black' />
                <Text className='text-black text-lg font-semibold'>
                    My Rewards
                </Text>
            </View>
        </TouchableOpacity>
    )
}