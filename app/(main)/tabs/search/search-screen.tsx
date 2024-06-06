import { ScrollView } from "react-native";
import { Stack } from "expo-router";

import { colors } from "~/constants/styling";

import SearchContextProvider from "./context/SearchContext";
import SearchBar from "./components/search-bar";
import SearchResults from "./components/search-results";
import SearchHeader from "./components/search-header";

export default function SearchScreen() {


    return (
        <SearchContextProvider>
            <Stack.Screen
                options={{
                    header: SearchHeader,
                }}
            />
            <ScrollView
                contentContainerStyle={{ gap: 12, ...colors.background }}
                keyboardShouldPersistTaps='handled'
            >
                <SearchBar />

                <SearchResults />
            </ScrollView>
        </SearchContextProvider>
    )
}