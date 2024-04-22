import Main from './screens/(main)/home';

import { useGlobalContext, type GlobalState } from "./context/GlobalContext";

export default function Index() {
    const { session } = useGlobalContext() as GlobalState;

    // if (!session) {
    //     return <Redirect href='/screens/welcome' />
    // }

    return (
        <Main />
    )
}