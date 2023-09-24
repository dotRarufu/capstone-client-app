import dateToEpoch from './dateToEpoch';

const combineDateAndTime = (dateString: string, timeEpoch: number) => {
  const date = new Date(dateString);
  const time = new Date(0);
  time.setUTCSeconds(timeEpoch);


  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  date.setMilliseconds(milliseconds);

  return dateToEpoch(date);
};

export default combineDateAndTime;
