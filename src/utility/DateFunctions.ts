export const formatDateTime = (startDateTime: any, endDateTime: any) => {
    // Convert start and end date strings to Date objects


    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);


    // Format day and month for start date
    let startDay: any = startDate.getDate();
    if (startDay < 10) {
        startDay = `0${startDay}`
    }

    const startMonth = startDate?.toLocaleString('default', { month: 'long' }).slice(0, 3);
    const startYear = startDate.getFullYear();


    // Format time for start and end time
    const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Construct formatted string
    const formattedStartDateTime = `${startDay} ${startMonth}, ${startYear} | ${startTime}`;
    const formattedEndDateTime = `${endTime}`;

    return `${formattedStartDateTime} to ${formattedEndDateTime}`;
}


