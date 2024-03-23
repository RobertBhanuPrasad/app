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