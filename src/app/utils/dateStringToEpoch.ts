export const dateStringToEpoch = (date: string) => {
    // Create a new Date object from the input date string
    var dateObject = new Date(date);
  
    // Get the number of milliseconds since January 1, 1970 00:00:00 UTC
    var epoch = dateObject.getTime();
  
    // Convert milliseconds to seconds (Unix timestamp)
    var epochInSeconds = Math.floor(epoch / 1000);
  
    // Return the epoch timestamp
    return epochInSeconds;
  }
  