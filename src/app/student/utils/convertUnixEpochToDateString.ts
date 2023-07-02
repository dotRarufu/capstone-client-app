export const convertUnixEpochToDateString = (unixEpoch: number) => {
  const date = new Date(unixEpoch * 1000);
  const monthName = date.toLocaleString('en-us', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const res = `${monthName} ${day} ${year}`;

  return res;
}