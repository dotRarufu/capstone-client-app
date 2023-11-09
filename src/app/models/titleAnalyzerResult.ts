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
  substantive_words: {
    count: number;
    words: string[];
  };
  readability: number;
}
