import { useState, createContext, useContext, useCallback } from "react";

import { searchStoresByName } from "@/utils/crud";

import { type MainState, useMainContext } from "~/app/(main)/context/MainContext";

import type { StoreData } from "@/types/helpers";
import type { Tables } from "~/app/types/supabase";

export type SearchState = {
    query: string
    results: Tables<'stores'>[]
    isEmpty: boolean
    isLoading: boolean
    onSearch: (query: string) => Promise<void>
    setQuery: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchContext = createContext<any>(null);

export const useSearchContext = () => {
    return useContext(SearchContext);
}

interface SearchContextProps {
    children: React.ReactNode
}

export default function SearchContextProvider({
    children
}: SearchContextProps) {
    const { storeDataMap, setStoreDataMap } = useMainContext() as MainState;
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Tables<'stores'>[]>([]);
    const [isEmpty, setIsEmpty] = useState<boolean>(false); // controls whether empty state is displayed to user
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const onSearch = async () => {
        if (query.length === 0) {
            setResults([]);
            setIsEmpty(false); // remove empty state
            return;
        }

        const res = await searchStoresByName(query);

        console.log({ res });

        if (res && res.length > 0) {
            setResults(res);
            setIsEmpty(false);
        } else {
            setResults([]);
            setIsEmpty(true);
        }
    }

    return (
        <SearchContext.Provider value={{
            query,
            results,
            isEmpty,
            isLoading,
            onSearch,
            setQuery,
            setIsLoading,
        }}>
            {children}
        </SearchContext.Provider>
    )
}