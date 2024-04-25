import { View, TouchableOpacity, ImageBackground } from 'react-native';
import { Stack } from "expo-router";

import { createBottomTabNavigator, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { CircleUserRound, DollarSign, HomeIcon } from "lucide-react-native";

import { Text } from '~/components/ui/text';
import { shadowStyles } from '~/lib/constants';

import { useMainContext, type MainState } from "./context/MainContext";

import Home from "./home-screen";
import Account from "./account-screen";
import MyRewards from "./my-rewards";

// couldn't get expo tabs to work, have to use react native tabs
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
                sceneContainerStyle={{
                    backgroundColor: 'rgb(241 245 249)'
                }}
            >
                <Tab.Screen 
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className='flex flex-col items-center justify-center gap-1'>
                                <HomeIcon size={24} color={focused ? '#EAB308' : '#222'} />
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
                                <View className='flex flex-row items-center justify-center bg-yellow-400 p-6 rounded-[25] top-[-62]' style={shadowStyles.small}>
                                    {/* <DollarSign size={28} color='black' /> */}
                                    <Text className='h-[28] text-xl mt-1'>
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
                                <CircleUserRound size={24} color={focused ? '#EAB308' : '#222'} />
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