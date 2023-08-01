export const dateToDateString = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  console.log("date to date stirng:", `${month}-${day}-${year}`);
  return `${month}-${day}-${year}`;
}