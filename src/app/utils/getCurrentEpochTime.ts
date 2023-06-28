export const getCurrentEpochTime = () => {
    const currentDate = new Date();
    const epochTime = Math.floor(currentDate.getTime() / 1000);
    return epochTime;
  }
  