/// <reference types="vite/client" />

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import QuizHome from './components/QuizHome';
import CreateQuiz from './components/CreateQuiz';
import QuizQuestion from './components/QuizQuestion';
import RecentQuizzes from './components/RecentQuizzes';
import Flashcards from './components/Flashcards';
import Leaderboard from './components/Leaderboard';
import QuizResult from './components/QuizResult';
import About from './components/About';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><QuizHome /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizQuestion /></ProtectedRoute>} />
          <Route path="/recent" element={<ProtectedRoute><RecentQuizzes /></ProtectedRoute>} />
          <Route path="/flashcards/:quizId" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
          <Route path="/leaderboard/:quizId" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/result/:quizId" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App; 