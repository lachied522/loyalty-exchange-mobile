import { useState, createContext, useContext, useCallback } from "react";

import { searchStoresByName } from "@/utils/crud";

import { type MainState, useMainContext } from "~/app/(main)/context/MainContext";

import type { StoreData } from "@/types/helpers";
import type { Tables } from "~/app/types/supabase";

export type SearchState = {
    query: string
    lastQuery: string
    results: Tables<'stores'>[]
    isEmpty: boolean
    isLoading: boolean
    onSearch: () => Promise<void>
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
    const [query, setQuery] = useState<string>('');
    const [lastQuery, setLastQuery] = useState<string>('');
    const [results, setResults] = useState<Tables<'stores'>[]>([]);
    const [isEmpty, setIsEmpty] = useState<boolean>(false); // controls whether empty state is displayed to user
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSearch = async () => {
        if (query.length === 0) {
            setResults([]);
            setIsEmpty(false); // remove empty state
            setLastQuery(query);
            return;
        }

        const res = await searchStoresByName(query);

        if (res && res.length > 0) {
            setResults(res);
            setIsEmpty(false);
        } else {
            setResults([]);
            setIsEmpty(true);
        }

        setLastQuery(query);
    }

    return (
        <SearchContext.Provider value={{
            query,
            lastQuery,
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