const toProjectNumber = (date: Date, integerValue: number): string => {
  // Get the current year from the date object
  const currentYear = date.getFullYear();

  // Format the integer with leading zeros using String.padStart
  const formattedInteger = String(integerValue).padStart(4, '0');

  // Combine the current year and formatted integer with a hyphen
  const result = `${currentYear}-${formattedInteger}`;

  return result;
};

export default toProjectNumber;