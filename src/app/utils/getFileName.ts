export const getFileName = (text: string) => {
  const lastIndex = text.lastIndexOf('/');
  if (lastIndex !== -1) {
    const extractedText = text.substring(lastIndex + 1);
    return extractedText;
  }

  throw new Error('wip, unnamed file');
}
