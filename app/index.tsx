import { Redirect } from 'expo-router';

import { useGlobalContext, type GlobalState } from "./context/GlobalContext";

export default function Index() {
    const { session } = useGlobalContext() as GlobalState;

    if (!session) {
        return <Redirect href='/welcome/' />
    }

    return <Redirect href='/home/' />
}