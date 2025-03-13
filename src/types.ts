export interface Question {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  type: 'multiple_choice' | 'true_false';
}

export interface RecentQuiz {
  quiz_id: string;
  content_name: string;
  total_questions: number;
  best_score: number;
  last_played: string;
  created_at: string;
  user_id: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  quiz_id: string;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  quiz_id: string;
  played_at: string;
} 