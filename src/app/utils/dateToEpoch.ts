const dateToEpoch = (date: Date) => {
  return Math.floor(date.getTime() / 1000); // Divide by 1000 to convert to seconds
};

export default dateToEpoch;
