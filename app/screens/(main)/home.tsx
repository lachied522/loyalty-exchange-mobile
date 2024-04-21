import { SafeAreaView, Text } from "react-native";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

export default function Home() {
    const { userData } = useGlobalContext() as GlobalState;

    return (
        <SafeAreaView>
            <Text>Main</Text>

            <Text>
                {JSON.stringify(userData)}
            </Text>
        </SafeAreaView>
    )
}