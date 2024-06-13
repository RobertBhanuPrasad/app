import dayjs from 'dayjs';
import { getTranslatedMonth } from './useGetLanguageCode';

export const formatDate = (dateString: any) => {

  const date = new Date(dateString)
  const day = date.getDate()
  const month = getTranslatedMonth(dateString)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'

  // Convert day to ordinal suffix
  const suffixes = ['th', 'st', 'nd', 'rd']
  const suffix = day % 10 < 4 && (day < 11 || day > 13) ? suffixes[day % 10] : suffixes[0]

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12

  // Add leading zero to minutes if necessary
  const formattedMinutes = String(minutes).padStart(2, '0')

  return `${day}${suffix} ${month} ${formattedHours}:${formattedMinutes} ${ampm}`
}
/**
 * Formats the start and end date/time strings into  08 Feb, 2024 |09:00 am to 12:00 pm format.
 * @param startDateTime The start date/time string.
 * @param endDateTime The end date/time string.
 * @returns A formatted string representing the start and end date/time 08 Feb, 2024 |09:00 am to 12:00 pm format.
 */
export const formatDateTime = (startDateTime: string, endDateTime: string) => {
  // Convert start and end date strings to Date objects
  const startDate = new Date(startDateTime)
  const endDate = new Date(endDateTime)

  // Format day and month for start date
  let startDay: string = startDate.getDate().toString()

  // Ensure single-digit days are prefixed with a '0'
  if (startDate.getDate() < 10) {
    startDay = `0${startDay}`
  }

  // Format month to display the first three letters of the month name
  const startMonth = getTranslatedMonth(startDate.toISOString())

  // Extract and format the year
  const startYear = startDate.getFullYear()

  // Format time for start and end time
  const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Construct formatted string for start date/time
  const formattedStartDateTime = `${startDay} ${startMonth}, ${startYear} | ${startTime}`

  // Construct formatted string for end time
  const formattedEndDateTime = `${endTime}`

  // Concatenate formatted start and end date/time strings with a separator and return the final formatted string 08 Feb, 2024 |09:00 am to 12:00 pm
  return `${formattedStartDateTime} to ${formattedEndDateTime}`
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
  const day = date.getDate()
  const month = getTranslatedMonth(date.toISOString())
  const year = date.getFullYear()

  // Return the formatted date string in the format "DD MMM, YYYY"
  return `${day.toString().padStart(2, '0')} ${month}, ${year}`
}

/**
 * Subtracts the specified number of days from the input date and formats the result as "DD MMM, YYYY".
 * @param days The number of days to subtract.
 * @param inputDate The input date.
 * @returns A string representing the formatted result date like this 16 Feb, 2024.
 */
export function subtractDaysAndFormat(days: number, inputDate: Date): string {
  // Clone the input date to avoid mutating it
  const resultDate = new Date(inputDate)

  // Subtract the specified number of days from the result date
  resultDate.setDate(resultDate.getDate() - days)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = resultDate.getDate()
  const month = months[resultDate.getMonth()]
  const year = resultDate.getFullYear()
  return `${day} ${month}, ${year}`
}

/**
 * Formats a given date string into "MMM DD, YYYY | HH:MM:SS" format.
 * @param dateString The date string to format.
 * @returns The formatted date and time string.
 */
export const formatDateAndTime = (dateString: any) => {
  const date = new Date(dateString)

  // Function to pad single digits with leading zeros
  const padZero = (num: any) => (num < 10 ? '0' + num : num)

  // Array of month names
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Format date in "MMM DD, YYYY" format
  const formattedDate = months[date.getMonth()] + ' ' + padZero(date.getDate()) + ', ' + date.getFullYear()

  // Format time in "HH:MM:SS" format
  const formattedTime = padZero(date.getHours()) + ':' + padZero(date.getMinutes()) + ':' + padZero(date.getSeconds())

  // Combine formatted date and time
  const result = formattedDate + ' | ' + formattedTime

  return result // Output format : Apr 11, 2024 | 19:30:52
}

// Function to format date as "27 Mar 2023"
export const formatGlobalDate = (dateString: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', options)
}
