// utils for formatting to ensure consistent presentation throughout app
import { format, intervalToDuration, formatDuration } from "date-fns";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function formatDollar(amount: number) {
    return USDollar.format(Math.abs(amount));
}

export function truncateText(text: string, maxLength: number) {
    return (
        text.length > maxLength?
        text.slice(0, maxLength - 3).trim() + '...':
        text
    );
}

export function formatDate(dateString: string, withTime: boolean = false) {
    const date = new Date(dateString);
    if (withTime) {
        return format(date, 'h:mma EEE dd MMMM');
    }
    return format(date, 'EEE dd MMMM');
}

export function formatTimeRemaining(endDateString: string) {
    // for formatting time remaining for limited time rewards
    const now = new Date();
    const intervalDuration = intervalToDuration({ start: now, end: endDateString });
    return formatDuration({ days: intervalDuration.days, hours: intervalDuration.hours || 0 }, { delimiter: ', ', zero: true });
}