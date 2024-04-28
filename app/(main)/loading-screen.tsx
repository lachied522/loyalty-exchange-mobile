import { View, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { RefreshCw } from "~/components/Icons";

export default function LoadingScreen() {
    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                
            />
            <ScrollView 
                contentContainerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center', padding: 24 }}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                <View className='animate-spin'>
                    {/* <RefreshCw strokeWidth={1} size={64} color='rgb(203 213 225)' /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}