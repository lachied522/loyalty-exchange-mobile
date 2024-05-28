import { useEffect, useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";

import { FlashList } from '@shopify/flash-list';

import { Text } from "~/components/ui/text";
import { Large } from "~/components/ui/typography";

import { truncateText } from '@/utils/formatting';

import { type SearchState, useSearchContext } from "../context/SearchContext";
import StoreImage from "~/app/(main)/components/store-image";

export default function SearchResults() {
    const { lastQuery, isEmpty, results } = useSearchContext() as SearchState;

    return (
        <View className='flex flew-col bg-white gap-4 p-3 pt-6'>
            {results.length > 0 && <Large>Results</Large>}

            <View className='p-3'>
                <FlashList
                    horizontal={!!results}
                    data={results}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='h-full mx-4'/>}
                    renderItem={({ item, index }) => (
                        <Link key={`store-search-item-${index}`} href={`../../store/${item.id}`}>
                            <View className='max-w-[180px] flex flex-col items-start gap-2'>
                                <StoreImage
                                    url={item.store_img_url}
                                    width={180}
                                />

                                {/* <Large className='font-display-semibold'>{truncateText(item.name, 20)}</Large> */}
                                <Large className='font-display-semibold'>{item.name}</Large>
                            </View>
                        </Link>
                        )
                    }
                    ListEmptyComponent={() => (
                        <View className='w-[360px] h-[240px] flex flex-col items-center justify-center gap-2 py-6'>
                            {isEmpty ? (
                            <Text>No search results for '{lastQuery}'.</Text>
                            ) : (
                            <Text className='text-center'>Use the search bar above to search for stores.</Text>
                            )}
                            
                        </View>
                    )}
                />
            </View>
        </View>
    )
}