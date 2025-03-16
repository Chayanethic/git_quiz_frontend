import { Question, RecentQuiz, Flashcard, LeaderboardEntry } from '../types';

// Add type declaration for import.meta
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}
const BASE_URL = import.meta.env.VITE_API_URL || 'https://git-quiz-server.onrender.com/api' ;
// Define the QuizResult interface locally if it's not properly imported
interface QuizResult {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  accuracy: number;
}
export const api = {
  // Quiz related endpoints
  getRecentQuizzes: async (): Promise<RecentQuiz[]> => {
    const response = await fetch(`${BASE_URL}/recent`);
    if (!response.ok) throw new Error('Failed to fetch recent quizzes');
    return response.json();
  },
  getUserQuizzes: async (userId: string): Promise<RecentQuiz[]> => {
    const response = await fetch(`${BASE_URL}/recent/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user quizzes');
    return response.json();
  },

  createQuiz: async (data: any): Promise<{ quiz_id: string }> => {
    const response = await fetch(`${BASE_URL}/create_content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create quiz');
    return response.json();
  },

  getQuiz: async (quizId: string): Promise<{ title: string, questions: Question[] }> => {
    const response = await fetch(`${BASE_URL}/quiz/${quizId}`);
    if (!response.ok) throw new Error('Failed to fetch quiz');
    return response.json();
  },

  // Flashcard related endpoints
  getFlashcards: async (quizId: string): Promise<{ flashcards: Flashcard[] }> => {
    const response = await fetch(`${BASE_URL}/flashcards/${quizId}`);
    if (!response.ok) throw new Error('Failed to fetch flashcards');
    return response.json();
  },

  // Score related endpoints
  submitScore: async (data: { quizId: string; playerName: string; score: number }): Promise<void> => {
    const apiData = {
      quizId: data.quizId,
      playerName: data.playerName,
      score: data.score
    };
    
    try {
      const response = await fetch(`${BASE_URL}/submit_score`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to submit score';
        try {
          const responseBody = await response.text();
          if (responseBody) {
            errorMessage = `${errorMessage}: ${responseBody}`;
          } else {
            errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
          }
        } catch (e) {
          errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    }
  },

  getLeaderboard: async (quizId: string): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${BASE_URL}/leaderboard/${quizId}`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
  //quiz result add in the last
  getQuizResult: async (quizId: string): Promise<QuizResult> => {
    const response = await fetch(`${BASE_URL}/leaderboard/${quizId}`);
    if (!response.ok) throw new Error('Failed to fetch quiz result');
    return response.json();
  },
}; 
