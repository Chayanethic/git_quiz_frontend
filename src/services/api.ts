import { Question, RecentQuiz, Flashcard, LeaderboardEntry } from '../types';

<<<<<<< HEAD
// Without declaration, TypeScript will use the default Vite types
const BASE_URL = import.meta.env.VITE_API_URL || 'https://git-quiz-server.onrender.com/api';
=======
// Define ImportMeta interface for Vite environment variables
interface ImportMeta {
  env: {
    VITE_API_URL?: string;
    [key: string]: string | undefined;
  };
}

// Use a default base URL if environment variable is not available
// This avoids TypeScript errors with import.meta.env
let BASE_URL = 'http://localhost:3000/api';

// Try to get the environment variable safely
try {
  // @ts-ignore - Ignore TypeScript error for environment access
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    BASE_URL = envUrl;
  }
} catch (error) {
  console.warn('Could not access environment variables, using default BASE_URL');
}
>>>>>>> 6c21ffc (mocktest add)

// Define the QuizResult interface locally if it's not properly imported
interface QuizResult {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  accuracy: number;
}

// Define subscription interfaces
interface SubscriptionInfo {
  free_generations_remaining: number;
  subscription_status: string;
  subscription_expiry: string | null;
}

interface SubscriptionResponse {
  message: string;
  plan: string;
  subscription_expiry: Date;
}

// Response type for quiz and PDF creation
export interface ContentCreateResponse {
  quiz_id: string;
  remaining_free: number;
  subscription_status?: string;
}

// Mock test interfaces
export interface MockTestResponse {
  message: string;
  test_id: string;
  download_link: string;
  topic: string;
  difficulty: string;
  num_questions: number;
  subscription_status: string;
  remaining_free: number;
}

export interface UserMockTest {
  test_id: string;
  topic: string;
  difficulty: string;
  num_questions: number;
  created_at: Date;
  download_link: string;
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

  createQuiz: async (data: any): Promise<ContentCreateResponse> => {
    const response = await fetch(`${BASE_URL}/create_content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create quiz');
    }
    
    const responseData = await response.json();
    console.log('Raw API response from createQuiz:', responseData);
    return responseData;
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

  uploadPdf: async (formData: FormData): Promise<ContentCreateResponse> => {
    const response = await fetch(`${BASE_URL}/upload_pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload PDF');
    }
    
    const responseData = await response.json();
    console.log('Raw API response from uploadPdf:', responseData);
    return responseData;
  },
  
  // Subscription related endpoints
  getUserSubscription: async (userId: string): Promise<SubscriptionInfo> => {
    // Add cache-busting parameter to prevent browser caching
    const timestamp = new Date().getTime();
    const response = await fetch(`${BASE_URL}/user/subscription/${userId}?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch subscription info');
    const data = await response.json();
    console.log('Raw subscription data from API:', data);
    return data;
  },
  
  subscribeToPlan: async (userId: string, plan: string): Promise<SubscriptionResponse> => {
    const response = await fetch(`${BASE_URL}/user/subscribe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({ userId, plan }),
    });
    if (!response.ok) throw new Error('Failed to subscribe to plan');
    return response.json();
  },
  
  uploadPaymentProof: async (userId: string, plan: string, paymentProof: File, transactionId: string): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append('paymentProof', paymentProof);
    formData.append('userId', userId);
    formData.append('plan', plan);
    formData.append('transactionId', transactionId);
    
    const response = await fetch(`${BASE_URL}/user/payment_proof`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload payment proof');
    }
    
    return response.json();
  },
  
  // Method to check if user can generate content - Not needed as the server handles this when creating content
  checkUserUsage: async (userId: string): Promise<{ 
    canGenerate: boolean; 
    remainingFree: number; 
    subscriptionStatus: string 
  }> => {
    // Add cache-busting parameter to prevent browser caching
    const timestamp = new Date().getTime();
    const response = await fetch(`${BASE_URL}/user/subscription/${userId}?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) throw new Error('Failed to check user usage');
    const data = await response.json();
    
    return {
      canGenerate: data.subscription_status !== 'free' || data.free_generations_remaining > 0,
      remainingFree: data.free_generations_remaining,
      subscriptionStatus: data.subscription_status
    };
  },

  // Mock test related endpoints
  generateMockTest: async (
    userId: string,
    topic: string,
    description: string,
    difficulty: string,
    numQuestions: number
  ): Promise<MockTestResponse> => {
    const response = await fetch(`${BASE_URL}/mock-test/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        topic,
        description,
        difficulty,
        num_questions: numQuestions
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate mock test');
    }
    
    return response.json();
  },

  getUserMockTests: async (userId: string): Promise<UserMockTest[]> => {
    const response = await fetch(`${BASE_URL}/mock-test/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user mock tests');
    
    const data = await response.json();
    // Convert string dates to Date objects
    return data.map((test: any) => ({
      ...test,
      created_at: new Date(test.created_at)
    }));
  },

  downloadMockTest: (testId: string): string => {
    // Return the full URL including BASE_URL to ensure the download works correctly
    return `${BASE_URL}/mock-test/download/${testId}`;
  }
}; 
