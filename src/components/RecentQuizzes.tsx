import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  FlashOn as FlashIcon,
  Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { RecentQuiz } from '../types';

const RecentQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<RecentQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.getRecentQuizzes();
      setQuizzes(response);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Recent Quizzes
        </Typography>

        <Grid container spacing={3}>
          {quizzes.map((quiz, index) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.quiz_id}>
              <Fade in={mounted} timeout={500 + index * 100}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {quiz.content_name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {/* <Chip 
                        label={`${quiz.total_questions} Questions`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      /> */}
                      {/* <Chip 
                        label={`Best Score: ${quiz.best_score || 0}`}
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      /> */}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Last played: {new Date(quiz.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => navigate(`/quiz/${quiz.quiz_id}`)}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Play Again
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <Button
                        variant="outlined"
                        startIcon={<FlashIcon />}
                        onClick={() => navigate(`/flashcards/${quiz.quiz_id}`)}
                        sx={{ flex: 1 }}
                      >
                        Flashcards
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<LeaderboardIcon />}
                        onClick={() => navigate(`/leaderboard/${quiz.quiz_id}`)}
                        sx={{ flex: 1 }}
                      >
                        Leaderboard
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default RecentQuizzes; 