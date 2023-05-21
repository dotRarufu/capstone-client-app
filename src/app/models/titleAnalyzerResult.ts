export interface TitleAnalyzerResult {
  title: string;
  title_uniqueness: number;
  category_rarity: {
    score: number;
    report: { category_id: number; score: number }[];
  };
  annual_category_uniqueness: {
    score: number;
    report: { category_id: number; title_id_list: number[] }[];
  };
  preferability: {
    score: number;
    report: {
      advisers: string[];
    };
  };
  substantive_words: {
    count: number;
    words: string[];
  };
  readability: number;
  initial_title: string;
  grammar_spelling_suggestions: {
    title: string;
    suggestions: {
      original_word: string;
      suggested_word: string;
    }[];
  };
  words_suggestions: {
    title: string;
    suggestions: {
      original_word: string;
      suggested_word: string;
    }[];
  };
}
