import { Link } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function ConvertAccountButton() {
    // TO DO: convert guest accounts to full accounts instead of redirecting to signup
    return (
        <Link href='/(start)/signup' replace asChild>
            <Button className='bg-neutral-100'>
                <Text>Create an account</Text>
            </Button>
        </Link>
    )
}