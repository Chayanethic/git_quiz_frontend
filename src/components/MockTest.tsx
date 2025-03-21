import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  Zoom,
  IconButton,
  Tooltip,
  Slider,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
} from '@mui/material';
import {
  Create as CreateIcon,
  School as SchoolIcon,
  QuestionAnswer as QuestionIcon,
  PictureAsPdf as PdfIcon,
  Warning as WarningIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  FolderOpen as FolderIcon,
  ConstructionOutlined as ConstructionIcon,
} from '@mui/icons-material';
import { api, MockTestResponse, UserMockTest } from '../services/api';
import { useSubscription } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const MockTest = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { canGenerate, remainingFree, subscriptionStatus, refreshSubscription, setRemainingFreeCount } = useSubscription();
  
  // Form states
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [numQuestions, setNumQuestions] = useState(10);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<MockTestResponse | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [recentTests, setRecentTests] = useState<UserMockTest[]>([]);
  const [recentTestsLoading, setRecentTestsLoading] = useState(false);
  
  // Fetch user's recent mock tests
  useEffect(() => {
    const fetchRecentTests = async () => {
      if (user?.id) {
        setRecentTestsLoading(true);
        try {
          const tests = await api.getUserMockTests(user.id);
          setRecentTests(tests);
        } catch (error) {
          console.error('Error fetching mock tests:', error);
          toast.error('Failed to load your mock tests');
        } finally {
          setRecentTestsLoading(false);
        }
      }
    };
    
    fetchRecentTests();
  }, [user?.id, success]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Check if user can generate
      if (!canGenerate) {
        setError('You have used all your free generations. Please subscribe to continue.');
        return;
      }
      
      // Generate mock test
      const response = await api.generateMockTest(
        user?.id || '',
        topic,
        description,
        difficulty,
        numQuestions
      );
      
      console.log('Mock test generated:', response);
      
      // Update remaining free count directly
      if (response.remaining_free !== undefined) {
        console.log('Setting remaining free count to:', response.remaining_free);
        setRemainingFreeCount(response.remaining_free);
      }
      
      // Refresh subscription data
      await refreshSubscription();
      
      setSuccess(response);
      setActiveStep(1);
      toast.success('Mock test generated successfully!');
      
    } catch (error: any) {
      console.error('Error generating mock test:', error);
      setError(error.message || 'Failed to generate mock test. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = (downloadLink: string) => {
    // If the link is just a placeholder (from our sample data), show a message
    if (downloadLink === '#') {
      toast.info('This is a demo. Download functionality will be available soon!');
      return;
    }

    // For real API responses, the download link may be relative or absolute
    // We'll use the link directly as the server should provide the full path
    window.open(downloadLink, '_blank');
  };
  
  // Special handler that uses the API service for consistent URL construction
  const handleDownloadById = (testId: string) => {
    const downloadUrl = api.downloadMockTest(testId);
    window.open(downloadUrl, '_blank');
  };
  
  const handleReset = () => {
    setSuccess(null);
    setActiveStep(0);
    setTopic('');
    setDescription('');
    setDifficulty('Intermediate');
    setNumQuestions(10);
  };
  
  const steps = ['Create Mock Test', 'Download Test'];
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Fade in timeout={800}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              mb: 6,
              background: 'linear-gradient(45deg, #2196F3, #00C853)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            AI Mock Test Generator
          </Typography>
        </Fade>
        
        {/* Stepper */}
        <Box sx={{ mb: 6 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        {/* Step 1: Create Form */}
        {activeStep === 0 && (
          <Grow in timeout={600}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={4}
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ 
                    p: 4, 
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: 'linear-gradient(90deg, #2196F3, #00C853)',
                    }
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Create a New Mock Test
                  </Typography>
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}
                  
                  {!canGenerate && (
                    <Alert 
                      severity="warning" 
                      sx={{ mb: 3 }}
                      icon={<WarningIcon />}
                      action={
                        <Button 
                          color="inherit" 
                          size="small" 
                          component={Link} 
                          to="/subscription"
                        >
                          Upgrade
                        </Button>
                      }
                    >
                      You have used all your free generations ({remainingFree} remaining). 
                      Subscribe to create unlimited mock tests.
                    </Alert>
                  )}
                  
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      required
                      placeholder="e.g. JavaScript Promises, React Hooks, Git Branching"
                      sx={{ mb: 3 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      multiline
                      rows={3}
                      placeholder="Provide details about what aspects of the topic to focus on"
                      sx={{ mb: 3 }}
                    />
                    
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Difficulty Level</InputLabel>
                      <Select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        label="Difficulty Level"
                      >
                        {difficultyLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>
                        Number of Questions: {numQuestions}
                      </Typography>
                      <Slider
                        value={numQuestions}
                        min={5}
                        max={50}
                        step={5}
                        marks={[
                          { value: 5, label: '5' },
                          { value: 25, label: '25' },
                          { value: 50, label: '50' },
                        ]}
                        onChange={(_, value) => setNumQuestions(value as number)}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || !canGenerate}
                      startIcon={loading ? <CircularProgress size={20} /> : <CreateIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 8,
                        background: 'linear-gradient(90deg, #2196F3, #00C853)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #1976D2, #00A040)',
                        },
                      }}
                    >
                      {loading ? 'Generating...' : 'Generate Mock Test'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={4}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #e3f2fd, #f5f5f5)',
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    What is a Mock Test?
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography paragraph>
                      Our AI-powered mock tests help you prepare for exams and assessments by:
                    </Typography>
                    
                    <List sx={{ pl: 2 }}>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Simulating exam conditions" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Providing realistic questions" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Including detailed explanations" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Covering your specific topics" />
                      </ListItem>
                    </List>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      icon={<QuestionIcon />} 
                      label={`${subscriptionStatus === 'free' ? remainingFree : 'Unlimited'} generations ${subscriptionStatus === 'free' ? 'remaining' : 'available'}`}
                      color={remainingFree > 0 || subscriptionStatus !== 'free' ? 'primary' : 'error'}
                      variant="outlined"
                      sx={{ mb: 1, mr: 1 }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grow>
        )}
        
        {/* Step 2: Download */}
        {activeStep === 1 && success && (
          <Zoom in timeout={600}>
            <Paper 
              elevation={4}
              sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #e8f5e9, #f5f5f5)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, #00C853, #2196F3)',
                }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Zoom in timeout={800}>
                  <PdfIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: '#00C853',
                      mb: 2
                    }} 
                  />
                </Zoom>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Your Mock Test is Ready!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Download your mock test PDF and start practicing
                </Typography>
              </Box>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, border: '1px dashed rgba(0, 0, 0, 0.12)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Topic:</strong> {success.topic}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Difficulty:</strong> {success.difficulty}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Questions:</strong> {success.num_questions}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Test ID:</strong> {success.test_id}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleDownloadById(success.test_id)}
                      startIcon={<DownloadIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        mb: 2,
                        borderRadius: 8,
                        background: 'linear-gradient(90deg, #00C853, #2196F3)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #00A040, #1976D2)',
                        },
                      }}
                    >
                      Download PDF
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      sx={{ mt: 1 }}
                    >
                      Create Another Test
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        )}
        
        {/* Recent Tests Section */}
        <Box sx={{ mt: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <HistoryIcon sx={{ mr: 1 }} />
            Your Recent Mock Tests
          </Typography>
          
          {recentTestsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : recentTests.length === 0 ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              You haven't created any mock tests yet. Generate your first test above!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {recentTests.map((test, index) => (
                <Grid item xs={12} sm={6} md={4} key={test.test_id}>
                  <Zoom in timeout={300 + index * 100}>
                    <Card 
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom noWrap>
                          {test.topic}
                        </Typography>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <Chip 
                            label={test.difficulty} 
                            size="small" 
                            sx={{ mr: 1 }} 
                            color={
                              test.difficulty === 'Beginner' ? 'success' :
                              test.difficulty === 'Intermediate' ? 'primary' :
                              test.difficulty === 'Advanced' ? 'secondary' : 'error'
                            }
                          />
                          <Chip 
                            label={`${test.num_questions} Q`} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                        >
                          Created: {test.created_at.toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          fullWidth
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadById(test.test_id)}
                          variant="contained"
                          size="small"
                        >
                          Download
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default MockTest; 