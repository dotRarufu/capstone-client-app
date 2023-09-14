const timeToEpoch = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid time format");
  }

  const now = new Date();
  const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

  return targetTime.getTime() / 1000; // Convert milliseconds to seconds for epoch time
}

export default timeToEpoch;
