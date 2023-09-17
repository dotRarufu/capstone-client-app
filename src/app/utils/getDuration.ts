import epochTo24hour from './epochTo24hour';

const getDuration = (startEpoch: number, endEpoch: number) => {
  const time1 = epochTo24hour(startEpoch);
  const time2 = epochTo24hour(endEpoch);

  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  const differenceMinutes = Math.abs(totalMinutes1 - totalMinutes2);

  const hours = Math.floor(differenceMinutes / 60);
  const minutes = differenceMinutes % 60;

  const hoursText = hours > 0 ? `${hours}h` : '';
  const minutesText = minutes > 0 ? `${minutes}min` : '';

  if (hoursText && minutesText) {
    return `${hoursText} ${minutesText}`;
  } else if (hoursText) {
    return hoursText;
  } else {
    return minutesText;
  }
};

export default getDuration;
