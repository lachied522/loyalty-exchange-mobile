
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