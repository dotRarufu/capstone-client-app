const getUniqueItems = <T>(arr: T[], propName: keyof T): T[] => {
  const uniqueMap = new Map<any, T>();
  
  for (const item of arr) {
    const key = item[propName];
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  }
  
  return [...uniqueMap.values()];
};

export default getUniqueItems;