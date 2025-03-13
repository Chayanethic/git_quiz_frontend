import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  LinearProgress,
  Alert,
  IconButton,
  Fade,
  Grow,
  Zoom,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  LibraryBooks as FlashcardIcon,
  Leaderboard as LeaderboardIcon,
  ArrowForward as NextIcon,
  Home as HomeIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Timer as TimerIcon,
  QuestionAnswer as QuestionIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { Question } from '../types';

// Confetti animation for correct answers
import Confetti from 'react-confetti';

const QuizQuestion = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playerName] = useState(localStorage.getItem('playerName') || '');
  const [showConfetti, setShowConfetti] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [mounted, setMounted] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (!loading && !answerSubmitted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answerSubmitted) {
      // Auto-submit when time runs out
      handleNext();
    }
  }, [timeLeft, loading, answerSubmitted]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (!loading) {
      setTimeLeft(30);
      setAnswerSubmitted(false);
    }
  }, [currentQuestion, loading]);

  const fetchQuestions = async () => {
    try {
      const response = await api.getQuiz(quizId!);
      setQuestions(response.questions);
      setQuizTitle(response.title || 'Quiz');
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch questions');
      console.error(err);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!answerSubmitted) {
      setSelectedAnswer(event.target.value);
    }
  };

  const checkAnswer = () => {
    const correct = selectedAnswer === questions[currentQuestion].answer;
    setIsCorrect(correct);
    setAnswerSubmitted(true);
    
    if (correct) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handleNext = async () => {
    if (!answerSubmitted && selectedAnswer) {
      checkAnswer();
      return;
    }
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setAnswerSubmitted(false);
    } else {
      // Quiz completed
      try {
        await api.submitScore({
          quizId: quizId!,
          playerName,
          score: score + (isCorrect ? 1 : 0),
        });
        navigate(`/result/${quizId}`);
      } catch (err) {
        console.error('Failed to submit score:', err);
        navigate(`/result/${quizId}`);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ 
          width: '100%', 
          mt: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 3
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading quiz questions...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container>
        <Alert 
          severity="error" 
          sx={{ 
            mt: 4, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          }
        >
          No questions available
        </Alert>
      </Container>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const timeProgress = (timeLeft / 30) * 100;

  return (
    <Container maxWidth="md">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Box 
        sx={{ 
          py: 4,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <Fade in={mounted} timeout={800}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h4" 
                color="primary" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {quizTitle}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Go to Home" arrow>
                  <IconButton 
                    onClick={() => navigate('/')}
                    sx={{ 
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="View Flashcards" arrow>
                  <IconButton 
                    onClick={() => navigate(`/flashcards/${quizId}`)}
                    sx={{ 
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <FlashcardIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="View Leaderboard" arrow>
                  <IconButton 
                    onClick={() => navigate(`/leaderboard/${quizId}`)}
                    sx={{ 
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <LeaderboardIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Paper 
              elevation={6} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '5px', 
                  background: 'linear-gradient(90deg, #2196f3, #21cbf3)' 
                }} 
              />
              
              <Box sx={{ mb: 3, position: 'relative' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
                    }
                  }}
                />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 1 
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Question {currentQuestion + 1} of {questions.length}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon sx={{ mr: 0.5, color: timeLeft < 10 ? 'error.main' : 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: timeLeft < 10 ? 'error.main' : 'text.secondary',
                        animation: timeLeft < 10 ? 'pulse 1s infinite' : 'none',
                      }}
                    >
                      {timeLeft} seconds
                    </Typography>
                  </Box>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={timeProgress} 
                  sx={{ 
                    height: 4, 
                    borderRadius: 5,
                    mt: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      background: timeLeft < 10 
                        ? 'linear-gradient(90deg, #ff9800, #f44336)' 
                        : 'linear-gradient(90deg, #4caf50, #8bc34a)',
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Chip 
                  icon={<QuestionIcon />} 
                  label={currentQ.type === 'true_false' ? 'True/False' : 'Multiple Choice'} 
                  color="primary" 
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 500,
                    lineHeight: 1.4,
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  {currentQ.question}
                  <Box 
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '2px',
                      bottom: '-4px',
                      left: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.3), transparent)',
                      borderRadius: '2px',
                    }}
                  />
                </Typography>
              </Box>

              <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
                {currentQ.type === 'true_false' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['True', 'False'].map((option) => (
                      <Grow 
                        in={mounted} 
                        key={option}
                        timeout={800 + (option === 'True' ? 0 : 200)}
                      >
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: answerSubmitted ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                            border: selectedAnswer === option 
                              ? '2px solid #2196f3' 
                              : '2px solid transparent',
                            backgroundColor: answerSubmitted
                              ? option === currentQ.answer
                                ? 'rgba(76, 175, 80, 0.1)'
                                : selectedAnswer === option
                                  ? 'rgba(244, 67, 54, 0.1)'
                                  : 'transparent'
                              : selectedAnswer === option
                                ? 'rgba(33, 150, 243, 0.1)'
                                : 'transparent',
                            '&:hover': {
                              backgroundColor: answerSubmitted
                                ? option === currentQ.answer
                                  ? 'rgba(76, 175, 80, 0.1)'
                                  : selectedAnswer === option
                                    ? 'rgba(244, 67, 54, 0.1)'
                                    : 'transparent'
                                : 'rgba(0, 0, 0, 0.04)',
                              transform: answerSubmitted ? 'none' : 'translateY(-2px)',
                              boxShadow: answerSubmitted ? 3 : '0 6px 12px rgba(0, 0, 0, 0.1)',
                            },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                          onClick={() => !answerSubmitted && setSelectedAnswer(option)}
                        >
                          <FormControlLabel
                            value={option}
                            control={
                              <Radio 
                                sx={{ 
                                  color: answerSubmitted
                                    ? option === currentQ.answer
                                      ? 'success.main'
                                      : selectedAnswer === option
                                        ? 'error.main'
                                        : 'primary.main'
                                    : 'primary.main',
                                  '&.Mui-checked': {
                                    color: answerSubmitted
                                      ? option === currentQ.answer
                                        ? 'success.main'
                                        : 'error.main'
                                      : 'primary.main',
                                  }
                                }} 
                              />
                            }
                            label={
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: selectedAnswer === option ? 500 : 400,
                                  color: answerSubmitted
                                    ? option === currentQ.answer
                                      ? 'success.main'
                                      : selectedAnswer === option
                                        ? 'error.main'
                                        : 'text.primary'
                                    : 'text.primary',
                                }}
                              >
                                {option}
                              </Typography>
                            }
                            sx={{ m: 0, flex: 1 }}
                          />
                          
                          {answerSubmitted && option === currentQ.answer && (
                            <CorrectIcon color="success" />
                          )}
                          
                          {answerSubmitted && option !== currentQ.answer && selectedAnswer === option && (
                            <WrongIcon color="error" />
                          )}
                        </Paper>
                      </Grow>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {currentQ.options?.map((option, index) => (
                      <Grow 
                        in={mounted} 
                        key={index}
                        timeout={800 + (index * 100)}
                      >
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: answerSubmitted ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                            border: selectedAnswer === option 
                              ? '2px solid #2196f3' 
                              : '2px solid transparent',
                            backgroundColor: answerSubmitted
                              ? option === currentQ.answer
                                ? 'rgba(76, 175, 80, 0.1)'
                                : selectedAnswer === option
                                  ? 'rgba(244, 67, 54, 0.1)'
                                  : 'transparent'
                              : selectedAnswer === option
                                ? 'rgba(33, 150, 243, 0.1)'
                                : 'transparent',
                            '&:hover': {
                              backgroundColor: answerSubmitted
                                ? option === currentQ.answer
                                  ? 'rgba(76, 175, 80, 0.1)'
                                  : selectedAnswer === option
                                    ? 'rgba(244, 67, 54, 0.1)'
                                    : 'transparent'
                                : 'rgba(0, 0, 0, 0.04)',
                              transform: answerSubmitted ? 'none' : 'translateY(-2px)',
                              boxShadow: answerSubmitted ? 3 : '0 6px 12px rgba(0, 0, 0, 0.1)',
                            },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                          onClick={() => !answerSubmitted && setSelectedAnswer(option)}
                        >
                          <FormControlLabel
                            value={option}
                            control={
                              <Radio 
                                sx={{ 
                                  color: answerSubmitted
                                    ? option === currentQ.answer
                                      ? 'success.main'
                                      : selectedAnswer === option
                                        ? 'error.main'
                                        : 'primary.main'
                                    : 'primary.main',
                                  '&.Mui-checked': {
                                    color: answerSubmitted
                                      ? option === currentQ.answer
                                        ? 'success.main'
                                        : 'error.main'
                                      : 'primary.main',
                                  }
                                }} 
                              />
                            }
                            label={
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: selectedAnswer === option ? 500 : 400,
                                  color: answerSubmitted
                                    ? option === currentQ.answer
                                      ? 'success.main'
                                      : selectedAnswer === option
                                        ? 'error.main'
                                        : 'text.primary'
                                    : 'text.primary',
                                }}
                              >
                                {option}
                              </Typography>
                            }
                            sx={{ m: 0, flex: 1 }}
                          />
                          
                          {answerSubmitted && option === currentQ.answer && (
                            <CorrectIcon color="success" />
                          )}
                          
                          {answerSubmitted && option !== currentQ.answer && selectedAnswer === option && (
                            <WrongIcon color="error" />
                          )}
                        </Paper>
                      </Grow>
                    ))}
                  </Box>
                )}
              </RadioGroup>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip 
                  icon={<TrophyIcon />} 
                  label={`Score: ${score}/${currentQuestion + (answerSubmitted ? 1 : 0)}`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedAnswer && !answerSubmitted}
                  size="large"
                  endIcon={answerSubmitted ? <NextIcon /> : null}
                  sx={{
                    borderRadius: 30,
                    px: 3,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(33, 150, 243, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                    }
                  }}
                  className="btn-ripple"
                >
                  {answerSubmitted 
                    ? (currentQuestion + 1 === questions.length ? 'Finish' : 'Next Question') 
                    : 'Submit Answer'}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Box>
    </Container>
  );
};

export default QuizQuestion; 