import { View, TouchableOpacity } from 'react-native';
import { Stack } from "expo-router";

import { createBottomTabNavigator, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { Text } from '~/components/ui/text';
import { shadowStyles } from '~/constants/constants';
import { Icon } from '~/components/Icons';

import { useMainContext, type MainState } from "./context/MainContext";

import HomeScreen from "./screens/home/home-screen";
import RewardsScreen from "./screens/rewards/rewards-screen";
import Account from "./screens/account/account-screen";

const Tab = createBottomTabNavigator();

export default function MainLayout() {
    const { myRewardsIsOpen, setMyRewardsIsOpen } = useMainContext() as MainState;

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />

            {myRewardsIsOpen && <RewardsScreen />}

            <Tab.Navigator
                screenOptions={{
                    tabBarLabelPosition: 'below-icon',
                    tabBarStyle: {
                        height: 100,
                        width: '100%',
                        backgroundColor: '#fffff',
                        paddingBottom: 20,
                        ...shadowStyles.edge,
                    }
                }}
                sceneContainerStyle={{
                    backgroundColor: 'rgb(245 245 245)'
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Icon name='Home' size={32} color={focused ? 'rgb(250 204 21)' : '#222'} />
                        ),
                        tabBarLabel: ({ focused }) => (
                            <Text className='font-display-semibold' style={{ color: focused ? 'rgb(250 204 21)' : '#222' }}>
                                Home
                            </Text>
                        )
                    }}
                />
                <Tab.Screen
                    name="My Rewards"
                    component={HomeScreen} // this is a filler component
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
                                <View className='flex flex-row items-center justify-center bg-gold px-6 py-5 rounded-xl top-[-12]'>
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
                            <Icon name='CircleUserRound' size={32} color={focused ? 'rgb(250 204 21)' : '#222'} />
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