// dateUtils.ts
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

// Кэшируем временную зону при первом вызове
let cachedTimeZone: string | null = null;

const getTimeZone = (): string => {
	if (!cachedTimeZone) {
		cachedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	}
	return cachedTimeZone;
};

export const formatUtcDate = (
	utcDateString: string,
	formatString: string = "yyyy-MM-dd HH:mm:ss"
): string => {
	try {
		if (!utcDateString) return "";
		const timeZone = getTimeZone();
		const localDate = toZonedTime(utcDateString, timeZone);
		return format(localDate, formatString);
	} catch (error) {
		console.error("Date formatting error:", error);
		return "Invalid date";
	}
};

// Специализированные функции для частых случаев
export const formatToTime = (utcDateString: string): string =>
	formatUtcDate(utcDateString, "HH:mm");

export const formatToDate = (utcDateString: string): string =>
	formatUtcDate(utcDateString, "dd.MM.yyyy");

export const formatToDateTime = (utcDateString: string): string =>
	formatUtcDate(utcDateString, "dd.MM.yyyy HH:mm");

// Для преобразования обратно в UTC
export const convertToUtc = (localDate: Date): string => {
	const timeZone = getTimeZone();
	return toZonedTime(localDate, timeZone).toISOString();
};
