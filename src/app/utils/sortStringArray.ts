export const sortStringArray = (
  arr: string[],
  order: 'asc' | 'desc'
): string[] => {
  return arr.slice().sort((a, b) => {
    if (order === 'asc') {
      return a.localeCompare(b);
    } else if (order === 'desc') {
      return b.localeCompare(a);
    } else {
      throw new Error('Invalid order. Please use "ascending" or "descending".');
    }
  });
};
