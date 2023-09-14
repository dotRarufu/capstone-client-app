const epochTo24hour = (epoch: number) => {
  const date = new Date(0);
  date.setUTCSeconds(epoch)
  const hours = date.getHours().toString().padStart(2, '0'); // Ensure two digits
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits

  return `${hours}:${minutes}`;
}

export default epochTo24hour;