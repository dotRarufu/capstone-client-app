export const getReadabilityScoreMeaning = (score: number) => {
  let meaning;

  switch (true) {
    case score <= 6:
      meaning = '6th grade student';
      break;
    case score === 7:
      meaning = '7th grade student';
      break;
    case score === 8:
      meaning = '8th grade student';
      break;
    case score === 9:
      meaning = 'high school freshman';
      break;
    case score === 10:
      meaning = 'high school sophomore';
      break;
    case score === 11:
      meaning = 'high school junior';
      break;
    case score === 12:
      meaning = 'high school senior';
      break;
    case score === 13:
      meaning = 'college freshman';
      break;
    case score >= 14:
      meaning = 'college sophomore';
      break;
    default:
      meaning = ' |error occured| ';
      break;
  }

  return meaning;
};
