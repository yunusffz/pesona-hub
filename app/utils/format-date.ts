/**
 * Indonesian month abbreviations
 */
const INDONESIAN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agt",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/**
 * Indonesian month full names
 */
const INDONESIAN_MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Format date to Indonesian format: "14 Okt 2025 • 09:23"
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string in Indonesian format
 *
 * @example
 * formatDateTimeIndonesian("2025-10-14T09:23:00") // "14 Okt 2025 • 09:23"
 * formatDateTimeIndonesian(new Date()) // "14 Okt 2025 • 09:23"
 */
export function formatDateTimeIndonesian(
  dateString?: string | Date | null
): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const month = INDONESIAN_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year} • ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

/**
 * Format date to Indonesian format without time: "14 Okt 2025"
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string in Indonesian format
 *
 * @example
 * formatDateIndonesian("2025-10-14") // "14 Okt 2025"
 */
export function formatDateIndonesian(
  dateString?: string | Date | null
): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const month = INDONESIAN_MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

/**
 * Format date with full month name: "14 Oktober 2025"
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string with full month name
 *
 * @example
 * formatDateFullMonth("2025-10-14") // "14 Oktober 2025"
 */
export function formatDateFullMonth(
  dateString?: string | Date | null
): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const month = INDONESIAN_MONTHS_FULL[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

/**
 * Format time only: "09:23"
 * @param dateString - ISO date string or Date object
 * @returns Formatted time string
 *
 * @example
 * formatTime("2025-10-14T09:23:00") // "09:23"
 */
export function formatTime(dateString?: string | Date | null): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) return "-";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "-";
  }
}

/**
 * Format relative time (e.g., "2 jam yang lalu", "3 hari yang lalu")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string in Indonesian
 *
 * @example
 * formatRelativeTime("2025-10-14T07:23:00") // "2 jam yang lalu" (if current time is 09:23)
 */
export function formatRelativeTime(dateString?: string | Date | null): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) return "-";

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "Baru saja";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} minggu yang lalu`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} bulan yang lalu`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} tahun yang lalu`;
    }
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "-";
  }
}

/**
 * Format date range: "14 - 20 Okt 2025"
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range
 *
 * @example
 * formatDateRange("2025-10-14", "2025-10-20") // "14 - 20 Okt 2025"
 * formatDateRange("2025-10-14", "2025-11-14") // "14 Okt - 14 Nov 2025"
 */
export function formatDateRange(
  startDate?: string | Date | null,
  endDate?: string | Date | null
): string {
  if (!startDate || !endDate) return "-";

  try {
    const start = typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";

    const startDay = start.getDate();
    const startMonth = INDONESIAN_MONTHS[start.getMonth()];
    const startYear = start.getFullYear();

    const endDay = end.getDate();
    const endMonth = INDONESIAN_MONTHS[end.getMonth()];
    const endYear = end.getFullYear();

    // Same month and year
    if (start.getMonth() === end.getMonth() && startYear === endYear) {
      return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    }

    // Same year
    if (startYear === endYear) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }

    // Different year
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return "-";
  }
}
