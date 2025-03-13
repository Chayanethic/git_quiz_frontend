import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Fade,
  Zoom,
  Grid,
  Chip,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timeline as ScoreIcon,
  Replay as RetryIcon,
  Home as HomeIcon,
  Share as ShareIcon,
  Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import Confetti from 'react-confetti';

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  accuracy: number;
}

const QuizResult = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      // Mock result data - replace with actual API call
      const mockResult = {
        score: 8,
        totalQuestions: 10,
        timeTaken: 300,
        accuracy: 80,
      };
      setResult(mockResult);
      if (mockResult.accuracy >= 70) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error) {
      console.error('Error fetching result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Calculating your results...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container>
        <Box sx={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="h5" color="error">
            Failed to load results
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/home')}
            sx={{ mt: 2 }}
          >
            Return Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Box
        sx={{
          minHeight: '100vh',
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <Fade in={mounted} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Quiz Complete!
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Here's how you performed
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Zoom in={mounted} style={{ transitionDelay: '200ms' }}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
                className="glass-effect"
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: 200,
                      height: 200,
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={200}
                      thickness={4}
                      sx={{ color: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={result.accuracy}
                      size={200}
                      thickness={4}
                      sx={{
                        color: result.accuracy >= 70 ? 'success.main' : 'warning.main',
                        position: 'absolute',
                        left: 0,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h3" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                        {result.accuracy}%
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Accuracy
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <TrophyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" gutterBottom>
                        {result.score}/{result.totalQuestions}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Final Score
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <ScoreIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" gutterBottom>
                        {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Time Taken
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={4}>
            <Fade in={mounted} timeout={1000}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RetryIcon />}
                  onClick={() => navigate(`/quiz/${quizId}`)}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                    },
                  }}
                >
                  Try Again
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LeaderboardIcon />}
                  onClick={() => navigate(`/leaderboard/${quizId}`)}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
                    },
                  }}
                >
                  View Leaderboard
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Add toast notification here
                  }}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(255, 152, 0, 0.3)',
                    },
                  }}
                >
                  Share Result
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/home')}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  Return Home
                </Button>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default QuizResult; 