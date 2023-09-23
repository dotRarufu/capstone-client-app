const sortArrayByProperty = <T>(
  arr: T[],
  propName: keyof T,
  order: 'asc' | 'desc'
) => {
  return arr.slice().sort((a, b) => {
    if (order === 'asc') {
      if (a[propName] < b[propName]) return -1;
      if (a[propName] > b[propName]) return 1;
      return 0;
    } else {
      if (a[propName] > b[propName]) return -1;
      if (a[propName] < b[propName]) return 1;
      return 0;
    }
  });
};

export default sortArrayByProperty;
