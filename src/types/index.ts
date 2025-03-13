export interface Question {
  question: string;
  type: 'true_false' | 'multiple_choice';
  options?: string[];
  answer: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface Quiz {
  quiz_id: string;
  title?: string;
  questions: Question[];
  flashcards: Flashcard[];
}

export interface RecentQuiz {
  quiz_id: string;
  content_name: string;
  created_at: string;
}

export interface LeaderboardEntry {
  player_name: string;
  score: number;
} 