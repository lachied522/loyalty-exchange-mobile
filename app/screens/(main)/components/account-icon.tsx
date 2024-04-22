import { Link } from "expo-router";

import { CircleUserRound } from "lucide-react-native";

import { Button } from "~/components/ui/button";

export default function AccountIcon() {
    return (
        <Link href='/account/' asChild>
            <Button className='w-14 h-14 bg-slate-100 rounded-full p-0'>
                <CircleUserRound size={42} color='black' />
            </Button>
        </Link>
    )
}