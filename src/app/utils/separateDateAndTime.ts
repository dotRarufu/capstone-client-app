const separateDateAndTime = (inputDate: Date): { date: Date, time: Date } => {
  // Create a new Date object with the same date as inputDate but with the time set to midnight (00:00:00)
  const dateOnly = new Date(inputDate);
  dateOnly.setHours(0, 0, 0, 0);

  // Create a new Date object with the same time as inputDate but with the date set to January 1, 1970
  const timeOnly =  getTimeFromDate(inputDate);

  return { date: dateOnly, time: timeOnly };
};

export default separateDateAndTime;



const getTimeFromDate = (date: Date) => {
  // Create a new Date object with the time portion from the input date
  const timeDate = new Date(0);
  timeDate.setUTCHours(date.getUTCHours());
  timeDate.setUTCMinutes(date.getUTCMinutes());
  timeDate.setUTCSeconds(date.getUTCSeconds());
  timeDate.setUTCMilliseconds(date.getUTCMilliseconds());

  return timeDate;
}
