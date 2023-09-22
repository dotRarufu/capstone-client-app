const hour24ToEpoch = (time24: string): Date => {
  const [hours, minutes] = time24.split(':').map(Number);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error('Invalid time format');
  }

  const currentDate = new Date();
  currentDate.setHours(hours, minutes, 0, 0);

  return currentDate;
};

export default hour24ToEpoch;