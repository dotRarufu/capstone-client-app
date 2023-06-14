export const formatStringArray = (strings: string[]) => {
  if (strings.length === 0) {
    return '';
  } else if (strings.length === 1) {
    return strings[0];
  } else {
    const lastWord = strings.pop();
    return `${strings.join(', ')} and ${lastWord}`;
  }
};