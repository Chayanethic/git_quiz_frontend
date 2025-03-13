import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Fade,
  Zoom,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as BrainIcon,
  Speed as SpeedIcon,
  Lightbulb as IdeaIcon,
  ArrowForward as ArrowIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <BrainIcon sx={{ fontSize: 40 }} />,
    title: 'AI-Powered',
    description: 'Advanced AI algorithms generate personalized quizzes tailored to your needs.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Real-time Results',
    description: 'Get instant feedback and track your progress as you learn.',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Learn Smarter',
    description: 'Adaptive learning paths that evolve with your understanding.',
  },
  {
    icon: <IdeaIcon sx={{ fontSize: 40 }} />,
    title: 'Interactive Learning',
    description: 'Engage with dynamic content and interactive flashcards.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setMounted(true);
    // Redirect to home if already signed in
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/home');
    } else {
      navigate('/sign-up');
    }
  };

  const handleLearnMore = () => {
    // Since we removed the About page, let's scroll to features section instead
    navigate('/about');
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated background elements */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`,
          }}
        />
      ))}

      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={mounted} timeout={1000}>
                <Box>
                  <Typography
                    variant={isMobile ? 'h3' : 'h1'}
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      mb: 2,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-10px',
                        left: 0,
                        width: '80px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #00ff87 0%, #60efff 100%)',
                        borderRadius: '2px',
                      },
                    }}
                  >
                    AI Quiz Generator
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      mb: 4,
                      maxWidth: 600,
                    }}
                  >
                    Transform your learning experience with our AI-powered quiz generator.
                    Create, learn, and test your knowledge in a whole new way.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGetStarted}
                      sx={{
                        borderRadius: '30px',
                        background: 'linear-gradient(90deg, #00ff87 0%, #60efff 100%)',
                        color: '#000',
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        },
                      }}
                      endIcon={<ArrowIcon />}
                    >
                      {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleLearnMore}
                      sx={{
                        borderRadius: '30px',
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: '#fff',
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#fff',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={mounted} timeout={1000}>
                <Box id="features" sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #00ff87 0%, #60efff 100%)',
                    borderRadius: '20px',
                    opacity: 0.3,
                    animation: 'pulse 2s infinite',
                  },
                }}>
                  <Paper
                    elevation={24}
                    sx={{
                      p: 4,
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                    className="glass-effect"
                  >
                    <Grid container spacing={3}>
                      {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Fade in={mounted} timeout={1000 + index * 200}>
                            <Box
                              sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                color: '#fff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  mb: 2,
                                  p: 2,
                                  borderRadius: '50%',
                                  background: 'rgba(255,255,255,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {feature.icon}
                              </Box>
                              <Typography variant="h6" gutterBottom>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {feature.description}
                              </Typography>
                            </Box>
                          </Fade>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              </Zoom>
            </Grid>
          </Grid>

          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <IconButton
              component="a"
              href="https://github.com"
              target="_blank"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  color: '#fff',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage; 