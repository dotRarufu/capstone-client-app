type KeysT = string | number; 
export const getObjectValues = <ValueT>(obj: {[key: KeysT]: ValueT}): ValueT[] => {
    const values = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        values.push(value);
      }
    }
    
    return values;
  }