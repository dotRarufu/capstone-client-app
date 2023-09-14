import dayFromDate from "./dayFromDate";

const dayFromEpoch = (e: number) => {
  const date = new Date(0);
  date.setUTCSeconds(e)
 
  return dayFromDate(date);
}