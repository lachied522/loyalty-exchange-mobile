import { useEffect, useState } from "react";
import { Icon } from "~/components/Icons";

const PHASE_MAP: {
    [key: number]: 'Clock1'|'Clock2'|'Clock3'|'Clock4'|'Clock5'|'Clock6'|'Clock7'|'Clock8'|'Clock9'|'Clock10'|'Clock11'|'Clock12'
} = {
    1: 'Clock1',
    2: 'Clock2',
    3: 'Clock3',
    4: 'Clock4',
    5: 'Clock5',
    6: 'Clock6',
    7: 'Clock7',
    8: 'Clock8',
    9: 'Clock9',
    10: 'Clock10',
    11: 'Clock11',
    12: 'Clock12',
}

interface TickingClockProps {
    size?: number
    color?: string
}

export default function TickingClock({ size = 24, color = 'black' }: TickingClockProps) {
    const [phase, setPhase] = useState<number>(12);

    useEffect(() => {
        const intervalID = setInterval(() => {
            setPhase((curr) => curr % 12 + 1);
        }, 1000);

        return () => {
            clearInterval(intervalID);
        }
    }, []);

    return <Icon name={PHASE_MAP[phase]} size={size} color={color} />;
}