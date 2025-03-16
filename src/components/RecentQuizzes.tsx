import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
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
  Tabs,
  Tab,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  FlashOn as FlashIcon,
  Leaderboard as LeaderboardIcon,
  Public as PublicIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { RecentQuiz } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quiz-tabpanel-${index}`}
      aria-labelledby={`quiz-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RecentQuizzes = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [globalQuizzes, setGlobalQuizzes] = useState<RecentQuiz[]>([]);
  const [userQuizzes, setUserQuizzes] = useState<RecentQuiz[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchGlobalQuizzes();
    if (user) {
      fetchUserQuizzes();
    }
  }, [user]);

  const fetchGlobalQuizzes = async () => {
    try {
      const response = await api.getRecentQuizzes();
      setGlobalQuizzes(response);
    } catch (error) {
      console.error('Error fetching global quizzes:', error);
      setError('Failed to load global quizzes. Please try again later.');
    } finally {
      setLoadingGlobal(false);
    }
  };

  const fetchUserQuizzes = async () => {
    if (!user) return;
    
    try {
      const response = await api.getUserQuizzes(user.id);
      setUserQuizzes(response);
    } catch (error) {
      console.error('Error fetching user quizzes:', error);
      setError('Failed to load your quizzes. Please try again later.');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderQuizGrid = (quizzes: RecentQuiz[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (quizzes.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          {tabValue === 0 ? 'No global quizzes available yet.' : 'You haven\'t created any quizzes yet.'}
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        {quizzes.map((quiz, index) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.quiz_id}>
            <Fade in={mounted} timeout={500 + index * 100}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {quiz.content_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(quiz.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => navigate(`/quiz/${quiz.quiz_id}`)}
                    fullWidth
                    sx={{ 
                      mb: 1,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    }}
                  >
                    Play Quiz
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
                      Scores
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Recent Quizzes
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#2196F3',
                height: 3,
              },
              '& .MuiTab-root': {
                fontWeight: 'bold',
                py: 2,
              },
            }}
          >
            <Tab 
              icon={<PublicIcon />} 
              label="Global Quizzes" 
              iconPosition="start"
            />
            <Tab 
              icon={<PersonIcon />} 
              label="My Quizzes" 
              iconPosition="start"
              disabled={!user}
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {renderQuizGrid(globalQuizzes, loadingGlobal)}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {user ? (
              renderQuizGrid(userQuizzes, loadingUser)
            ) : (
              <Alert severity="info">
                Please sign in to view your quizzes.
              </Alert>
            )}
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default RecentQuizzes; 