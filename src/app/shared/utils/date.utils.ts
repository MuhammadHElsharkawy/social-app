export type DateInput = Date | string | number;
export type DateFormatPreset = 'short' | 'medium' | 'long' | 'full' | 'timeOnly' | 'dateTime';

const PRESETS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    timeOnly: { hour: '2-digit', minute: '2-digit' },
    dateTime: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
};

export function parseDate(date: DateInput): Date {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatDate(
    date: DateInput,
    format: DateFormatPreset | Intl.DateTimeFormatOptions = 'short',
    locale = 'en-US'
): string {
    const targetDate = parseDate(date);
    const options = typeof format === 'string' ? PRESETS[format] : format;
    return new Intl.DateTimeFormat(locale, options).format(targetDate);
}

export function formatCompactTimeAgo(date: DateInput, fallbackDaysThreshold = 30): string {
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    const diffInDays = Math.abs(diffInSeconds / 86400);

    if (diffInDays >= fallbackDaysThreshold) {
        return formatDate(targetDate, 'medium');
    }

    if (diffInSeconds < 5) return 'now';

    const units = [
        { label: 'y', seconds: 31536000 },
        { label: 'mo', seconds: 2592000 },
        { label: 'w', seconds: 604800 },
        { label: 'd', seconds: 86400 },
        { label: 'h', seconds: 3600 },
        { label: 'm', seconds: 60 },
        { label: 's', seconds: 1 },
    ];

    for (const { label, seconds } of units) {
        const value = Math.floor(diffInSeconds / seconds);
        if (value >= 1) {
            return `${value}${label}`;
        }
    }

    return 'now';
}
