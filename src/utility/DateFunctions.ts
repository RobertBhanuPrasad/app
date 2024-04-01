/**
 * Formats the start and end date/time strings into  08 Feb, 2024 |09:00 am to 12:00 pm format.
 * @param startDateTime The start date/time string.
 * @param endDateTime The end date/time string.
 * @returns A formatted string representing the start and end date/time 08 Feb, 2024 |09:00 am to 12:00 pm format.
 */
export const formatDateTime = (startDateTime: string, endDateTime: string) => {
    // Convert start and end date strings to Date objects
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    // Format day and month for start date
    let startDay: string = startDate.getDate().toString();

    // Ensure single-digit days are prefixed with a '0'
    if (startDate.getDate() < 10) {
        startDay = `0${startDay}`
    }

    // Format month to display the first three letters of the month name
    const startMonth = startDate?.toLocaleString('default', { month: 'long' }).slice(0, 3);

    // Extract and format the year
    const startYear = startDate.getFullYear();

    // Format time for start and end time
    const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Construct formatted string for start date/time
    const formattedStartDateTime = `${startDay} ${startMonth}, ${startYear} | ${startTime}`;

    // Construct formatted string for end time
    const formattedEndDateTime = `${endTime}`;

    // Concatenate formatted start and end date/time strings with a separator and return the final formatted string 08 Feb, 2024 |09:00 am to 12:00 pm
    return `${formattedStartDateTime} to ${formattedEndDateTime}`;
}



