import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { EmojiEvents as TrophyIcon, QuestionAnswer as QuizIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';

const Leaderboard = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quizId) fetchLeaderboard();
  }, [quizId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.getLeaderboard(quizId!);
      setLeaderboard(response.leaderboard);
    } catch (err) {
      setError('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container><Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box></Container>;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" color="primary">Leaderboard</Typography>
          <Button variant="outlined" startIcon={<QuizIcon />} onClick={() => navigate(`/quiz/${quizId}`)}>Take Quiz</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper elevation={3}>
          {leaderboard.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No scores yet. Be the first to complete this quiz!</Typography>
            </Box>
          ) : (
            <List>
              {leaderboard.map((entry, index) => (
                <ListItem key={index} sx={{ py: 2, px: 3, backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h5" sx={{ width: 40, color: index === 0 ? 'warning.main' : 'text.secondary', fontWeight: 'bold' }}>
                      {index + 1}
                    </Typography>
                    {index === 0 && <TrophyIcon sx={{ color: 'warning.main', fontSize: 30, mr: 1 }} />}
                    <ListItemText
                      primary={entry.player_name}
                      secondary={`Score: ${entry.score}`}
                      primaryTypographyProps={{ fontWeight: index < 3 ? 'bold' : 'normal', color: index === 0 ? 'warning.main' : 'text.primary' }}
                      secondaryTypographyProps={{ color: index === 0 ? 'warning.main' : 'text.secondary' }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Leaderboard; 