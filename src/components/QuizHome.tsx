import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk, UserProfile } from '@clerk/clerk-react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Zoom,
  Fade,
  IconButton,
  Switch,
  FormControlLabel,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogContent,
  Backdrop,
  Fab,
  Stack,
} from '@mui/material';
import {
  Add as CreateIcon,
  List as ListIcon,
  School as LearnIcon,
  EmojiEvents as TrophyIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  FlashOn as FlashIcon,
  Lightbulb as IdeaIcon,
  Psychology as BrainIcon,
  Explore as ExploreIcon,
  FlipToBack as FlipIcon,
  ArrowForward as ArrowIcon,
  ArrowBackOutlined,
  QuestionAnswer as QuestionAnswerIcon,
  Close as CloseIcon,
  SportsKabaddi as BattleIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { Flashcard, RecentQuiz } from '../types';

// Import confetti effect
import Confetti from 'react-confetti';

const QuizHome = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [recentFlashcards, setRecentFlashcards] = useState<Flashcard[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAskMeAny, setShowAskMeAny] = useState(false);
  const [showQuizBattle, setShowQuizBattle] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
    
    // Show confetti for 3 seconds when the page loads
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch recent flashcards and quizzes
  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        if (user) {
          // Get up to 5 recent quizzes
          const recentQuizzes = await api.getRecentQuizzes();
          const topQuizzes = recentQuizzes.slice(0, 5);
          setRecentQuizzes(topQuizzes);
          
          // Get one flashcard from each quiz
          const flashcardsPromises = topQuizzes.map(async (quiz) => {
            try {
              const response = await api.getFlashcards(quiz.quiz_id);
              // Return the first flashcard with the quiz info
              return response.flashcards.length > 0 
                ? { ...response.flashcards[0], quiz_id: quiz.quiz_id, quiz_title: quiz.content_name } 
                : null;
            } catch (err) {
              console.error(`Error fetching flashcards for quiz ${quiz.quiz_id}:`, err);
              return null;
            }
          });
          
          const flashcardsResults = await Promise.all(flashcardsPromises);
          // Filter out any null results
          const validFlashcards = flashcardsResults.filter(card => card !== null);
          setRecentFlashcards(validFlashcards);
        }
      } catch (error) {
        console.error("Error fetching recent data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentData();
  }, [user]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    }
  }, [darkMode]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleOpenUserProfile = () => {
    setShowUserProfile(true);
    handleMenuClose();
  };

  const handleCloseUserProfile = () => {
    setShowUserProfile(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleFeatureHover = (index: number | null) => {
    setActiveFeature(index);
  };

  const handleFlipCard = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  const handleFlashcardClick = (index: number, quizId: string) => {
    // First flip the card for visual feedback
    handleFlipCard(index);
    
    // Then navigate to the flashcards page after a short delay
    setTimeout(() => {
      navigate(`/flashcards/${quizId}`);
    }, 500); // 500ms delay to allow the flip animation to be visible
  };

  const handleOpenAskMeAny = () => {
    setShowAskMeAny(true);
  };

  const handleCloseAskMeAny = () => {
    setShowAskMeAny(false);
  };

  const handleOpenQuizBattle = () => {
    // Open in a new tab instead of showing dialog
    window.open('https://quiz-battle.onrender.com/', '_blank');
  };


  const features = [
    {
      title: 'Create Quiz',
      description: 'Create a new quiz with AI-generated questions and flashcards',
      icon: <CreateIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/create'),
      color: '#2196f3',
      delay: 100,
      bgImage: 'url(https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80)',
    },
    {
      title: 'Recent Quizzes',
      description: 'View and take recently created quizzes',
      icon: <ListIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/recent'),
      color: '#4caf50',
      delay: 200,
      bgImage: 'url(https://images.unsplash.com/photo-1550592704-6c76defa9985?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80)',
    },
    {
      title: 'Study Mode',
      description: 'Practice with flashcards and review materials',
      icon: <LearnIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/recent'),
      color: '#ff9800',
      delay: 300,
      bgImage: 'url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80)',
    },
    {
      title: 'Leaderboards',
      description: 'Check your ranking and compete with others',
      icon: <TrophyIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/recent'),
      color: '#f50057',
      delay: 400,
      bgImage: 'url(https://images.unsplash.com/photo-1569517282132-25d22f4573e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80)',
    },
  ];

  const iconComponents = [
    <FlashIcon key="flash" sx={{ fontSize: 24, color: '#ff9800' }} />,
    <IdeaIcon key="idea" sx={{ fontSize: 24, color: '#4caf50' }} />,
    <BrainIcon key="brain" sx={{ fontSize: 24, color: '#2196f3' }} />,
    <ExploreIcon key="explore" sx={{ fontSize: 24, color: '#f50057' }} />,
  ];

  return (
    <Container maxWidth="lg">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Clerk User Profile Dialog */}
      <Dialog 
        open={showUserProfile} 
        onClose={handleCloseUserProfile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <UserProfile />
        </DialogContent>
      </Dialog>

      {/* AskMeAny Dialog */}
      <Dialog
        open={showAskMeAny}
        onClose={handleCloseAskMeAny}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            height: '80vh',
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <IconButton
              onClick={handleCloseAskMeAny}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <iframe
              src="https://askmeany.vercel.app"
              title="AskMeAny"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Backdrop for blur effect - only for AskMeAny */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(5px)',
        }}
        open={showAskMeAny}
        onClick={handleCloseAskMeAny}
      />
      
      {/* Floating Action Buttons */}
      <Stack 
        direction="column" 
        spacing={2}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        {/* Quiz Battle Button */}
        <Zoom in={mounted} style={{ transitionDelay: '600ms' }}>
          <Fab
            color="primary"
            aria-label="Quiz Battle"
            sx={{
              background: 'linear-gradient(45deg, #673AB7 30%, #9C27B0 90%)',
              boxShadow: '0 8px 16px rgba(103, 58, 183, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #673AB7 30%, #9C27B0 90%)',
                transform: 'scale(1.1) rotate(-10deg)',
                boxShadow: '0 12px 20px rgba(103, 58, 183, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onClick={handleOpenQuizBattle}
            className="pulse-animation-purple"
          >
            <BattleIcon />
          </Fab>
        </Zoom>
        
        {/* AskMeAny Button */}
        <Zoom in={mounted} style={{ transitionDelay: '500ms' }}>
          <Fab
            color="secondary"
            aria-label="Ask Me Any"
            sx={{
              background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
              boxShadow: '0 8px 16px rgba(255, 87, 34, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
                transform: 'scale(1.1) rotate(10deg)',
                boxShadow: '0 12px 20px rgba(255, 87, 34, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onClick={handleOpenAskMeAny}
            className="pulse-animation-orange"
          >
            <QuestionAnswerIcon />
          </Fab>
        </Zoom>
      </Stack>
      
      <Box
        sx={{
          minHeight: '100vh',
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          color: 'var(--text-primary)',
        }}
      >
        {/* Floating icons animation */}
        {mounted && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {[...Array(10)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.1 + Math.random() * 0.2,
                  transform: `scale(${0.5 + Math.random() * 1.5})`,
                  animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`,
                }}
              >
                {iconComponents[Math.floor(Math.random() * iconComponents.length)]}
              </Box>
            ))}
          </Box>
        )}
        
        <Fade in={mounted} timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%', 
            mb: 6,
            position: 'relative',
            zIndex: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 },
            }}>
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
                  textShadow: '0 2px 10px rgba(33, 150, 243, 0.3)',
                  position: 'relative',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
                className="animate-float"
              >
                AI Quiz Generator
                <Box 
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '4px',
                    bottom: '-8px',
                    left: 0,
                    background: 'linear-gradient(90deg, transparent, #2196F3, transparent)',
                    borderRadius: '2px',
                  }}
                />
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderRadius: '30px',
                  padding: '4px 12px',
                }}
                className="animate-fadeIn delay-300"
              >
                <LightModeIcon sx={{ color: darkMode ? 'text.secondary' : 'warning.main', mr: 1 }} />
                <Switch 
                  checked={darkMode} 
                  onChange={toggleDarkMode} 
                  color="primary" 
                  size="small"
                />
                <DarkModeIcon sx={{ color: darkMode ? 'primary.main' : 'text.secondary', ml: 1 }} />
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              justifyContent: { xs: 'flex-end', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' },
            }}>
              <Tooltip title="Notifications" arrow TransitionComponent={Zoom}>
                <IconButton 
                  className="animate-pulse"
                  sx={{ 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <NotificationIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings" arrow TransitionComponent={Zoom}>
                <IconButton 
                  className="animate-pulse"
                  sx={{ 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                  onClick={handleOpenUserProfile}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="About" arrow TransitionComponent={Zoom}>
                <IconButton 
                  className="animate-pulse"
                  sx={{ 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                  onClick={() => navigate('/about')}
                >
                  <ArrowBackOutlined />
                </IconButton>
              </Tooltip>
              
              <Avatar
                src={user?.imageUrl}
                alt={user?.fullName || 'User'}
                sx={{ 
                  width: { xs: 36, sm: 40 }, 
                  height: { xs: 36, sm: 40 }, 
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  border: '2px solid #fff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  }
                }}
                onClick={handleMenuOpen}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: darkMode ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem disabled>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  {user?.fullName || 'User'}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpenUserProfile}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  Profile Settings
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in={mounted} timeout={800 + feature.delay}>
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: darkMode ? 'var(--card-bg)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    '&:hover': {
                      transform: { xs: 'translateY(-8px) scale(1.01)', sm: 'translateY(-12px) scale(1.02)' },
                      boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                      '& .feature-icon-container': {
                        transform: 'scale(1.1)',
                      },
                      '& .feature-background': {
                        opacity: 0.2,
                      },
                      '& .feature-image': {
                        opacity: 0.7,
                        transform: 'scale(1.1)',
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '5px',
                      background: feature.color,
                    }
                  }}
                  className={`shadow-hover card-3d ${activeFeature === index ? 'animate-pulse' : ''}`}
                  onMouseEnter={() => handleFeatureHover(index)}
                  onMouseLeave={() => handleFeatureHover(null)}
                >
                  {/* Background image with overlay */}
                  <Box 
                    className="feature-image"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: feature.bgImage,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.1,
                      transition: 'all 0.4s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                      }
                    }}
                  />
                  
                  <Box 
                    className="feature-background"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '200%',
                      height: '200%',
                      background: `radial-gradient(circle, ${feature.color}10 0%, transparent 70%)`,
                      opacity: 0.1,
                      transition: 'opacity 0.4s ease',
                      zIndex: 0,
                    }}
                  />
                  
                  <Box
                    className="feature-icon-container animate-float"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${feature.color}15`,
                      color: feature.color,
                      mb: 2,
                      transition: 'all 0.4s ease',
                      position: 'relative',
                      zIndex: 1,
                      boxShadow: `0 10px 20px ${feature.color}30`,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      position: 'relative',
                      zIndex: 1,
                      color: feature.color,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, flexGrow: 1, position: 'relative', zIndex: 1 }}
                  >
                    {feature.description}
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={feature.action}
                    sx={{
                      backgroundColor: feature.color,
                      position: 'relative',
                      zIndex: 1,
                      borderRadius: '30px',
                      px: 3,
                      py: 1,
                      boxShadow: `0 8px 16px ${feature.color}40`,
                      '&:hover': {
                        backgroundColor: feature.color,
                        filter: 'brightness(1.1)',
                        boxShadow: `0 12px 24px ${feature.color}60`,
                      },
                    }}
                    className="btn-ripple"
                  >
                    Get Started
                  </Button>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Recent Flashcards Section */}
        {recentFlashcards.length > 0 && (
          <Box sx={{ width: '100%', mt: { xs: 4, sm: 6, md: 8 } }}>
            <Fade in={mounted} timeout={1200}>
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 4,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FlipIcon 
                      sx={{ 
                        fontSize: { xs: 24, sm: 32 }, 
                        color: '#ff9800',
                        animation: 'rotate 8s linear infinite',
                      }} 
                    />
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #FF9800 30%, #FF5722 90%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                      }}
                    >
                      Recent Flashcards
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    color="warning"
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate('/recent')}
                    sx={{ 
                      borderRadius: 30,
                      px: 3,
                      boxShadow: '0 4px 8px rgba(255, 152, 0, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                        boxShadow: '0 6px 12px rgba(255, 152, 0, 0.3)',
                      }
                    }}
                  >
                    View All Quizzes
                  </Button>
                </Box>
                
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {recentFlashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={index === 4 ? 12 : 6} lg={index === 4 ? 12 : 3} key={index}>
                      <Fade in={mounted} timeout={1200 + (index * 200)}>
                        <Card 
                          sx={{ 
                            height: { xs: 180, sm: 200, md: 220 },
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.6s',
                            transform: flippedCard === index ? 'rotateY(180deg)' : 'none',
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                            cursor: 'pointer',
                            backgroundColor: darkMode ? 'var(--card-bg)' : 'var(--bg-primary)',
                            '&:hover': {
                              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                            }
                          }}
                          onClick={() => handleFlashcardClick(index, flashcard.quiz_id)}
                          className="card-3d"
                        >
                          {/* Front side */}
                          <Box
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              p: 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                              <Chip 
                                label="Term" 
                                color="warning" 
                                size="small" 
                                icon={<LearnIcon />}
                              />
                              <Chip
                                label={flashcard.quiz_id}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  maxWidth: '60%',
                                  '& .MuiChip-label': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }
                                }}
                              />
                            </Box>
                            
                            <CardContent sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexGrow: 1,
                              p: 2,
                            }}>
                              <Typography 
                                variant="h6" 
                                align="center"
                                sx={{ 
                                  fontWeight: 500,
                                  color: 'var(--text-primary)',
                                }}
                              >
                                {flashcard.term}
                              </Typography>
                            </CardContent>
                            
                            <CardActions sx={{ justifyContent: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                Click to flip
                              </Typography>
                            </CardActions>
                          </Box>
                          
                          {/* Back side */}
                          <Box
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                              display: 'flex',
                              flexDirection: 'column',
                              p: 2,
                              backgroundColor: darkMode ? 'var(--card-bg)' : 'var(--bg-primary)',
                            }}
                          >
                            <Chip 
                              label="Definition" 
                              color="info" 
                              size="small" 
                              icon={<IdeaIcon />}
                              sx={{ alignSelf: 'flex-start', mb: 1 }}
                            />
                            
                            <CardContent sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexGrow: 1,
                              p: 2,
                            }}>
                              <Typography 
                                variant="body1" 
                                align="center"
                                sx={{ 
                                  fontWeight: 400,
                                  color: 'var(--text-primary)',
                                }}
                              >
                                {flashcard.definition}
                              </Typography>
                            </CardContent>
                            
                            <CardActions sx={{ justifyContent: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                Click to flip back
                              </Typography>
                            </CardActions>
                          </Box>
                          
                          {/* Decorative elements */}
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '5px',
                              background: 'linear-gradient(90deg, #FF9800, #FF5722)',
                              zIndex: 2,
                            }}
                          />
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Box>
        )}

        {/* Footer Section */}
        <Box 
          sx={{ 
            width: '100%', 
            mt: { xs: 6, sm: 8, md: 10 },
            pt: 4,
            borderTop: '1px solid',
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <Fade in={mounted} timeout={1500}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  opacity: 0.8,
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                © Copyright 2025 by Team Alpha - All Rights Reserved
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Container>
  );
};

// Add this CSS to your global styles or create a new style tag
const styles = `
  @keyframes pulse-orange {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.7);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(255, 87, 34, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 87, 34, 0);
    }
  }
  
  @keyframes pulse-purple {
    0% {
      box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.7);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(103, 58, 183, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(103, 58, 183, 0);
    }
  }
  
  .pulse-animation-orange {
    animation: pulse-orange 2s infinite;
  }
  
  .pulse-animation-purple {
    animation: pulse-purple 2s infinite;
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

export default QuizHome; 
