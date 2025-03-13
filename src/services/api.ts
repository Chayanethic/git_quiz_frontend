import { Question, RecentQuiz, Flashcard, LeaderboardEntry } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://gitquizserver-production.up.railway.app/api';

export const api = {
  // Quiz related endpoints
  getRecentQuizzes: async (): Promise<RecentQuiz[]> => {
    const response = await fetch(`${BASE_URL}/recent`);
    if (!response.ok) throw new Error('Failed to fetch recent quizzes');
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
    const response = await fetch(`${BASE_URL}/submit_score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit score');
  },

  getLeaderboard: async (quizId: string): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${BASE_URL}/leaderboard/${quizId}`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
}; 