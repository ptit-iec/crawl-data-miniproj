import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function formatDate(dateString: string): string {

  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  }

  const parts = dateString.split("·");
  if (parts.length >= 2) {
    const date = new Date(parts[1].trim());
    if (!isNaN(date.getTime())) {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  }


  const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return `${day}/${month}/${year}`;
  }

  // fallback
  return dateString;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Parse time string in format "8:48 AM PST · November 4, 2025" to Date
 */
export function parsePostTime(timeString: string): Date {
  if (!timeString) return new Date(0);

  try {
    // Format: "8:48 AM PST · November 4, 2025"
    const parts = timeString.split("·");
    if (parts.length < 2) return new Date(0);

    const datePart = parts[1].trim(); // "November 4, 2025"
    const timePart = parts[0].trim(); // "8:48 AM PST"

    // Extract time and timezone
    const timeMatch = timePart.match(/(\d{1,2}):(\d{2})\s(AM|PM)/);
    if (!timeMatch) return new Date(0);

    const [, hourStr, minuteStr, period] = timeMatch;
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    // Convert to 24-hour format
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    // Parse date string
    const date = new Date(datePart);
    date.setHours(hour, minute, 0, 0);

    return date;
  } catch (error) {
    console.warn(`Failed to parse time: ${timeString}`, error);
    return new Date(0);
  }
}

/**
 * Sort articles by time
 * @param order 'newest' - newest first, 'oldest' - oldest first
 */
export function sortArticlesByTime<T extends { publishedAt?: string; time?: string }>(
  articles: T[],
  order: "newest" | "oldest" = "newest"
): T[] {
  return [...articles].sort((a, b) => {
    const timeStrA = (a.publishedAt || a.time || "") as string;
    const timeStrB = (b.publishedAt || b.time || "") as string;
    
    const dateA = parsePostTime(timeStrA);
    const dateB = parsePostTime(timeStrB);

    if (order === "newest") {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });
}

/**
 * Filter articles by time range
 * @param articles Articles to filter
 * @param timeRange 'all' - all articles, 'today' - today, 'week' - this week, 'month' - this month
 */
export function filterArticlesByTimeRange<T extends { publishedAt?: string; time?: string }>(
  articles: T[],
  timeRange: "all" | "today" | "week" | "month" = "all"
): T[] {
  if (timeRange === "all") {
    return articles;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate: Date;

  if (timeRange === "today") {
    startDate = new Date(today);
  } else if (timeRange === "week") {
    // Get the start of the week (Monday)
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate = new Date(today);
    startDate.setDate(today.getDate() - daysFromMonday);
  } else if (timeRange === "month") {
    // Get the first day of the month
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    return articles;
  }

  return articles.filter((article) => {
    const timeStr = (article.publishedAt || article.time || "") as string;
    const articleDate = parsePostTime(timeStr);
    return articleDate >= startDate;
  });
}
