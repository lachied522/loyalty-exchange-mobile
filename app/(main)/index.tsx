import { useCallback, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Stack } from "expo-router";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Text } from '~/components/ui/text';
import { shadowStyles } from '~/constants/styling';
import { Icon } from '~/components/Icons';

import { useMainContext, type MainState } from "./context/MainContext";

import HomeScreen from "./screens/home/home-screen";
import RewardsScreen from "./screens/rewards/rewards-screen";
import Account from "./screens/account/account-screen";
import SearchScreen from './screens/search/search-screen';

const Tab = createBottomTabNavigator();

const FillerComponent = () => {
    return null
}

export default function MainIndex() {
    const { refreshUserDataAndUpdateState, setMyRewardsIsOpen } = useMainContext() as MainState;

    useEffect(() => {
        // refresh user data once when component mounts
        refreshUserDataAndUpdateState();
    }, []);

    const handleRewardsPress = useCallback(() => {
        // Toggle rewards modal or visibility
        setMyRewardsIsOpen((curr) => !curr);
    }, [setMyRewardsIsOpen]);

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <RewardsScreen />

            <Tab.Navigator
                screenOptions={{
                    tabBarLabelPosition: 'below-icon',
                    tabBarStyle: {
                        height: 100,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        backgroundColor: 'white',
                        paddingTop: 12,
                        paddingBottom: 20,
                        ...shadowStyles.edge,
                    }
                }}
                sceneContainerStyle={{
                    backgroundColor: 'white'
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Icon name='Home' size={30} color={focused ? 'rgb(250 204 21)' : '#222'} />
                        ),
                        tabBarLabel: ({ focused }) => (
                            <Text className='font-display-semibold' style={{ color: focused ? 'rgb(250 204 21)' : '#222' }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Icon name='Search' size={30} color={focused ? 'rgb(250 204 21)' : '#222'} />
                        ),
                        tabBarLabel: ({ focused }) => (
                            <Text className='font-display-semibold' style={{ color: focused ? 'rgb(250 204 21)' : '#222' }}>
                                Search
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="My Rewards"
                    component={FillerComponent} // this is a filler component
                    options={{
                        tabBarButton: () => (
                            <TouchableOpacity onPress={handleRewardsPress}>
                                <View className='flex flex-row items-center justify-center bg-gold px-5 py-4 rounded-xl top-[-4]' style={shadowStyles.button}>
                                    <Text className='h-[24px] text-xl font-display-semibold'>
                                        Rewards
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
                            <Icon name='CircleUserRound' size={30} color={focused ? 'rgb(250 204 21)' : '#222'} />
                        ),
                        tabBarLabel: ({ focused }) => (
                            <Text className='font-display-semibold' style={{ color: focused ? 'rgb(250 204 21)' : '#222' }}>
                                Account
                            </Text>
                        )
                    }}
                />
            </Tab.Navigator>
        </>
    )
}