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
