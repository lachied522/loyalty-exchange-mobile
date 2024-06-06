
const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function formatDollar(amount: number) {
    return USDollar.format(Math.abs(amount));
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    return `${dayOfWeek} ${day} ${monthName}`;
}

export function truncateText(text: string, maxLength: number) {
    return text.length > maxLength?
    text.slice(0, maxLength - 3).trim() + '...':
    text;
}

export function formatTimeRemaining(endDateString: string) {
    // for formatting time remaining for limited time rewards
    const now = new Date();
    const endDate = new Date(endDateString);
    const delta = endDate.getTime() - now.getTime();

    const hour = 60 * 60 * 1000;
    const day = hour * 24;

    const daysRemaining = Math.floor(delta / day);
    const hoursRemaining = Math.floor((delta % day) / hour);

    return `${daysRemaining} days, ${hoursRemaining} hours`;
}