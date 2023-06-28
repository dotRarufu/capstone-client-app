export const getTimeFromEpoch = (epochTime: number) => {
    // Convert epoch time to milliseconds
    const dateTime = new Date(epochTime * 1000);
    
    // Extract hours, minutes, and seconds from the date object
    let hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    
    // Determine if it's AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours %= 12;
    hours = hours || 12;
    
    // Format the time as HH:MMAM/PM
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
    
    return formattedTime;
  }
  