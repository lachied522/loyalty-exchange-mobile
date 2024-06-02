import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";

import { Input } from "~/components/ui/input";
import { Search } from "~/components/Icons";

import { type SearchState, useSearchContext } from "../context/SearchContext";

export default function SearchBar() {
    const { query, setQuery, onSearch } = useSearchContext() as SearchState;
    
    return (
        <View className='p-6 bg-white'>
            <View className='w-full flex flex-row gap-3.5 justify-between border border-neutral-200 rounded-lg'>
                <Input
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                    onSubmitEditing={onSearch}
                    maxLength={64}
                    autoCapitalize='none'
                    className='border-white'
                    style={styles.input}
                />
                
                <TouchableOpacity onPress={onSearch}>
                    <View className='h-[48px] w-[48px] flex items-center justify-center bg-neutral-50 rounded-lg'>
                        <Search size={24} color='black' />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        width: 240,
        height: 48,
        ...(Platform.OS === 'ios' ? {paddingVertical: 10} : {})
    }
})