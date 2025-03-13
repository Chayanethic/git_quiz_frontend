import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Fade,
  Grow,
  Chip,
  LinearProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Refresh as RefreshIcon,
  QuestionAnswer as QuizIcon,
  Home as HomeIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Check as CheckIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { Flashcard } from '../types';
import Confetti from 'react-confetti';

const Flashcards = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [mastered, setMastered] = useState<number[]>([]);
  const [showMastered, setShowMastered] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (quizId) {
      fetchFlashcards();
    }
  }, [quizId]);

  // Update progress when mastered cards change
  useEffect(() => {
    if (flashcards.length > 0) {
      setProgress((mastered.length / flashcards.length) * 100);
    }
  }, [mastered, flashcards]);

  const fetchFlashcards = async () => {
    try {
      const response = await api.getFlashcards(quizId!);
      setFlashcards(response.flashcards);
    } catch (err) {
      setError('Failed to fetch flashcards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (cardRef.current) {
      cardRef.current.classList.add('animate-slideLeft');
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex((prev) => {
          // Skip mastered cards if showMastered is false
          let nextIndex = (prev + 1) % flashcards.length;
          if (!showMastered) {
            let count = 0;
            while (mastered.includes(nextIndex) && count < flashcards.length) {
              nextIndex = (nextIndex + 1) % flashcards.length;
              count++;
            }
            // If all cards are mastered, show the first one
            if (count === flashcards.length) {
              return prev;
            }
          }
          return nextIndex;
        });
        if (cardRef.current) {
          cardRef.current.classList.remove('animate-slideLeft');
        }
      }, 300);
    }
  };

  const handlePrev = () => {
    if (cardRef.current) {
      cardRef.current.classList.add('animate-slideRight');
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex((prev) => {
          // Skip mastered cards if showMastered is false
          let prevIndex = (prev - 1 + flashcards.length) % flashcards.length;
          if (!showMastered) {
            let count = 0;
            while (mastered.includes(prevIndex) && count < flashcards.length) {
              prevIndex = (prevIndex - 1 + flashcards.length) % flashcards.length;
              count++;
            }
            // If all cards are mastered, show the current one
            if (count === flashcards.length) {
              return prev;
            }
          }
          return prevIndex;
        });
        if (cardRef.current) {
          cardRef.current.classList.remove('animate-slideRight');
        }
      }, 300);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const toggleMastered = () => {
    if (mastered.includes(currentIndex)) {
      setMastered(mastered.filter(index => index !== currentIndex));
    } else {
      setMastered([...mastered, currentIndex]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const toggleShowMastered = () => {
    setShowMastered(!showMastered);
    // If turning off mastered cards and current card is mastered, find next unmastered
    if (showMastered && mastered.includes(currentIndex)) {
      let nextUnmastered = -1;
      for (let i = 0; i < flashcards.length; i++) {
        if (!mastered.includes(i)) {
          nextUnmastered = i;
          break;
        }
      }
      if (nextUnmastered !== -1) {
        setCurrentIndex(nextUnmastered);
      }
    }
  };

  const shuffleCards = () => {
    setIsShuffled(true);
    // Find a random unmastered card if showMastered is false
    if (!showMastered) {
      const unmasteredIndices = flashcards
        .map((_, index) => index)
        .filter(index => !mastered.includes(index));
      
      if (unmasteredIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * unmasteredIndices.length);
        setCurrentIndex(unmasteredIndices[randomIndex]);
      }
    } else {
      // Otherwise just pick a random card
      const randomIndex = Math.floor(Math.random() * flashcards.length);
      setCurrentIndex(randomIndex);
    }
    setFlipped(false);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh',
          gap: 3
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading flashcards...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          py: 4,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <Grow in={mounted}>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              No flashcards available for this quiz.
            </Alert>
          </Grow>
          
          <Fade in={mounted} timeout={800}>
            <Button
              variant="contained"
              onClick={() => navigate(`/quiz/${quizId}`)}
              startIcon={<QuizIcon />}
              fullWidth
              sx={{
                borderRadius: 30,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(33, 150, 243, 0.4)',
                }
              }}
              className="btn-ripple"
            >
              Go to Quiz
            </Button>
          </Fade>
        </Box>
      </Container>
    );
  }

  const filteredFlashcards = showMastered 
    ? flashcards 
    : flashcards.filter((_, index) => !mastered.includes(index));

  const currentCardIsMastered = mastered.includes(currentIndex);

  return (
    <Container maxWidth="md">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Box sx={{ 
        py: 4,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        <Fade in={mounted} timeout={800}>
          <Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Flashcards
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Go Home" arrow>
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
                
                <Tooltip title="Go to Quiz" arrow>
                  <IconButton 
                    onClick={() => navigate(`/quiz/${quizId}`)}
                    sx={{ 
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <QuizIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Mastery Progress: {mastered.length} of {flashcards.length} cards
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                  }
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title={showMastered ? "Hide Mastered Cards" : "Show All Cards"} arrow>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={showMastered ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  onClick={toggleShowMastered}
                  sx={{ 
                    borderRadius: 30,
                    px: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  {showMastered ? "Hide Mastered" : "Show All"}
                </Button>
              </Tooltip>
              
              <Tooltip title="Shuffle Cards" arrow>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShuffleIcon />}
                  onClick={shuffleCards}
                  sx={{ 
                    borderRadius: 30,
                    px: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  Shuffle
                </Button>
              </Tooltip>
              
              <Tooltip title={currentCardIsMastered ? "Unmark as Mastered" : "Mark as Mastered"} arrow>
                <Button
                  variant="outlined"
                  size="small"
                  color={currentCardIsMastered ? "success" : "primary"}
                  startIcon={currentCardIsMastered ? <CheckIcon /> : <BookmarkBorderIcon />}
                  onClick={toggleMastered}
                  sx={{ 
                    borderRadius: 30,
                    px: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  {currentCardIsMastered ? "Mastered" : "Mark Mastered"}
                </Button>
              </Tooltip>
            </Box>

            <Paper
              elevation={6}
              ref={cardRef}
              sx={{
                p: 4,
                minHeight: isMobile ? 250 : 350,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'none',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: isDarkMode ? 'var(--card-bg)' : 'var(--bg-primary)',
                boxShadow: currentCardIsMastered 
                  ? '0 10px 30px rgba(76, 175, 80, 0.3)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: currentCardIsMastered 
                  ? '2px solid rgba(76, 175, 80, 0.5)' 
                  : '2px solid transparent',
              }}
              onClick={handleFlip}
              className="card-3d"
            >
              {/* Card side indicator */}
              <Chip 
                label={flipped ? "Definition" : "Term"} 
                color="primary" 
                size="small"
                icon={flipped ? <LightbulbIcon /> : <SchoolIcon />}
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16,
                  transform: flipped ? 'rotateY(180deg)' : 'none',
                  backfaceVisibility: 'hidden',
                  zIndex: 1,
                }}
              />
              
              {/* Mastered indicator */}
              {currentCardIsMastered && (
                <Chip 
                  label="Mastered" 
                  color="success" 
                  size="small"
                  icon={<CheckIcon />}
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16,
                    transform: flipped ? 'rotateY(180deg)' : 'none',
                    backfaceVisibility: 'hidden',
                    zIndex: 1,
                  }}
                />
              )}
              
              {/* Card number indicator */}
              <Typography
                variant="body2"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  color: 'text.secondary',
                  transform: flipped ? 'rotateY(180deg)' : 'none',
                  backfaceVisibility: 'hidden',
                }}
              >
                Card {currentIndex + 1} of {flashcards.length}
              </Typography>
              
              {/* Decorative elements */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
                  transform: flipped ? 'rotateY(180deg)' : 'none',
                  backfaceVisibility: 'hidden',
                }}
              />
              
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '30%',
                  height: '30%',
                  background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
                  transform: flipped ? 'rotateY(180deg)' : 'none',
                  backfaceVisibility: 'hidden',
                }}
              />
              
              {/* Front content */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  transform: flipped ? 'rotateY(180deg)' : 'none',
                  backfaceVisibility: 'hidden',
                  opacity: flipped ? 0 : 1,
                  padding: 2,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  sx={{
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {flashcards[currentIndex].term}
                </Typography>
                
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    mt: 2,
                    color: 'text.secondary',
                  }}
                >
                  (Click to reveal definition)
                </Typography>
              </Box>
              
              {/* Back content */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: flipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  opacity: flipped ? 1 : 0,
                  padding: 2,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  sx={{
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {flashcards[currentIndex].definition}
                </Typography>
                
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    mt: 2,
                    color: 'text.secondary',
                  }}
                >
                  (Click to see term)
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Tooltip title="Previous Card" arrow>
                <IconButton 
                  onClick={handlePrev} 
                  color="primary" 
                  size="large"
                  sx={{ 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <PrevIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Reset Card" arrow>
                <IconButton 
                  onClick={() => setFlipped(false)} 
                  color="primary" 
                  size="large"
                  sx={{ 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Next Card" arrow>
                <IconButton 
                  onClick={handleNext} 
                  color="primary" 
                  size="large"
                  sx={{ 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <NextIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Container>
  );
};

export default Flashcards; 