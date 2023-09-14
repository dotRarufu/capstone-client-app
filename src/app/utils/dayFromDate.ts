const dayFromDate = (date: Date) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = date.getDay();

  if (dayIndex >= 0 && dayIndex < daysOfWeek.length) {
    return daysOfWeek[dayIndex];
  } else {
    throw new Error('Invalid day index');
  }
}

export default dayFromDate;
