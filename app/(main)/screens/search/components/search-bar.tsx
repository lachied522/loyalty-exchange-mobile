import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { Input } from "~/components/ui/input";
import { Search } from "~/components/Icons";
import { Button } from "~/components/ui/button";

import { type SearchState, useSearchContext } from "../context/SearchContext";

export default function SearchBar() {
    const { query, setQuery, onSearch } = useSearchContext() as SearchState;
    // bug with Button component - functions passed as 'onPress' are not updated with state
    // issue is avoided by using react ref
    const queryRef = useRef<typeof query>(query);

    useEffect(() => {
        queryRef.current = query;
    }, [query]);

    const onPress = () => {
        onSearch(queryRef.current);
    }

    return (
        <View className='p-6 bg-white'>
            <View className='w-full flex flex-row gap-3.5 justify-between border border-neutral-200 rounded-lg'>
                <Input
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                    onSubmitEditing={onPress}
                    autoCapitalize='none'
                    className='w-[240px] border-white'
                />
                
                <Button
                    onPress={onPress}
                    className='bg-neutral-50 rounded-lg'
                >
                    <Search size={24} color='black' />
                </Button>
            </View>
        </View>
    )
}