export const formatDate = (dateString: any) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert day to ordinal suffix
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = day % 10 < 4 && (day < 11 || day > 13) ? suffixes[day % 10] : suffixes[0];

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Add leading zero to minutes if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${day}${suffix} ${month} ${formattedHours}:${formattedMinutes} ${ampm}`;
}
/**
 * Formats a Date object into a string in the format "DD MMM, YYYY".
 * @param date The Date object to format.
 * @returns A formatted date string.
 *
 * Input example:
 * const inputDate = new Date("2024-02-08");
 *
 * Output example:
 * formatDateString(inputDate) returns "08 Feb, 2024"
 */
export const formatDateString = (date: Date): string => {
  // Extract day, month, and year components from the Date object
  const day = date.getDate();
  const month = date?.toLocaleString("default", { month: "long" }).slice(0, 3);
  const year = date.getFullYear();

  // Return the formatted date string in the format "DD MMM, YYYY"
  return `${day.toString().padStart(2, "0")} ${month}, ${year}`;
};
