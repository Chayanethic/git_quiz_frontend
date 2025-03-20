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
  FormControlLabel,
  Checkbox,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Create as CreateIcon,
  Help as HelpIcon,
  ArrowBack as BackIcon,
  Send as SendIcon,
  School as SchoolIcon,
  QuestionAnswer as QuestionIcon,
  Settings as SettingsIcon,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { api, ContentCreateResponse } from '../services/api';
import { useSubscription } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoInformationCircleOutline } from 'react-icons/io5';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { 
    canGenerate, 
    remainingFree, 
    subscriptionStatus, 
    refreshSubscription,
    setRemainingFreeCount
  } = useSubscription();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageRange, setPageRange] = useState<[number, number]>([1, 1]);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  
  // Define activeTab state based on whether a PDF file is present
  const activeTab = pdfFile ? 'pdf' : 'text';
  
  const [formData, setFormData] = useState<{
    text: string;
    content_name: string;
    question_type: string;
    num_options: number;
    num_questions: number | null;
    include_flashcards: boolean | null;
  }>({
    text: '',
    content_name: '',
    question_type: 'multiple_choice',
    num_options: 4,
    num_questions: null,
    include_flashcards: false,
  });

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
    // Refresh subscription status when component mounts
    refreshSubscription();
  }, []);

  // Debug output
  useEffect(() => {
    console.log('Current subscription state:', { 
      canGenerate, 
      remainingFree, 
      subscriptionStatus 
    });
  }, [canGenerate, remainingFree, subscriptionStatus]);

  const steps = ['Quiz Details', 'Content', 'Question Settings'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canGenerate) {
      toast.error(
        "You've reached your free generation limit. Please upgrade your subscription to continue.",
        { position: "top-center" }
      );
      return;
    }
    
    // Validate form data before submission
    if (formData.content_name.trim() === '') {
      toast.error("Please provide a quiz name", { position: "top-center" });
      setActiveStep(0); // Go back to first step
      return;
    }
    
    if (formData.num_questions === null) {
      toast.error("Please select the number of questions", { position: "top-center" });
      setActiveStep(2); // Go to question settings step
      return;
    }
    
    if (formData.include_flashcards === null) {
      toast.error("Please specify whether to include flashcards", { position: "top-center" });
      setActiveStep(2); // Go to question settings step
      return;
    }
    
    if (activeTab === 'text' && formData.text.trim() === '') {
      toast.error("Please provide content text or upload a PDF", { position: "top-center" });
      setActiveStep(1); // Go to content step
      return;
    }
    
    setLoading(true);
    
    try {
      if (activeStep === steps.length - 1) {
        // Only submit if we're on the last step
        if (activeTab === 'text') {
          if (!formData.text.trim()) {
            setError('Please provide either a PDF file or enter text content.');
            setLoading(false);
            return;
          }
          
          // Ensure number of questions is within limits for text input as well
          const validatedFormData = {
            ...formData,
            num_questions: Math.min(Math.max(formData.num_questions || 10, 1), 50)
          };
          
          const response = await api.createQuiz({ ...validatedFormData, user_id: user!.id });
          console.log('Create quiz response:', response);
          
          // Directly update the subscription state with the new value
          if (response.remaining_free !== undefined) {
            console.log(`Updating remaining free count to: ${response.remaining_free}`);
            setRemainingFreeCount(response.remaining_free);
          }
          
          // Navigate to the created quiz
          navigate(`/quiz/${response.quiz_id}`);
        } else if (activeTab === 'pdf' && pdfFile) {
          // Create FormData for file upload
          const formDataObj = new FormData();
          formDataObj.append('pdf', pdfFile);
          formDataObj.append('startPage', pageRange[0].toString());
          formDataObj.append('endPage', pageRange[1].toString());
          formDataObj.append('question_type', formData.question_type);
          formDataObj.append('num_options', formData.num_options.toString());
          formDataObj.append('num_questions', Math.min(Math.max(formData.num_questions || 10, 1), 50).toString()); // Ensure between 1 and 50
          formDataObj.append('include_flashcards', formData.include_flashcards === true ? 'true' : 'false');
          formDataObj.append('content_name', formData.content_name);
          formDataObj.append('user_id', user!.id);

          const response = await api.uploadPdf(formDataObj);
          console.log('PDF upload response:', response);
          
          // Directly update the subscription state with the new value
          if (response.remaining_free !== undefined) {
            console.log(`Updating remaining free count to: ${response.remaining_free}`);
            setRemainingFreeCount(response.remaining_free);
          }
          
          // Navigate to the created quiz
          navigate(`/quiz/${response.quiz_id}`);
        }
        
        // Refresh subscription info (as a secondary update)
        setTimeout(() => refreshSubscription(), 500);
      } else {
        handleNext();
      }
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      
      if (error.message.includes('limit')) {
        toast.error("You've reached your limit. Please upgrade your subscription.");
      } else {
        toast.error(error.message || "Failed to create quiz");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown; type?: string; checked?: boolean; } }) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name as string]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      // For now, we'll set a dummy value for total pages
      // In a real implementation, you might want to read this from the PDF
      const dummyTotalPages = 10;
      setTotalPages(dummyTotalPages);
      setPageRange([1, dummyTotalPages]);
      
      // Clear the text input since we're using PDF
      setFormData(prev => ({
        ...prev,
        text: ''
      }));
    } else {
      setPdfFile(null);
      setTotalPages(1);
      setPageRange([1, 1]);
    }
  };

  const handlePageRangeChange = (event: Event, newValue: number | number[]) => {
    setPageRange(newValue as [number, number]);
  };

  // Add marks for the slider
  const questionMarks = [
    { value: 1, label: '1' },
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' },
  ];

  // Handle slider change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFormData(prev => ({
      ...prev,
      num_questions: newValue as number
    }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0} timeout={500}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CreateIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" color="primary">Quiz Details</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Quiz Name"
                name="content_name"
                value={formData.content_name}
                onChange={handleChange}
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1} timeout={500}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" color="primary">Content</Typography>
              </Box>

              <Box sx={{ mb: 4, p: 3, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2 }}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Upload PDF
                  </Button>
                </label>
                
                {pdfFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      <PdfIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {pdfFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Pages: {totalPages}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Select Page Range:
                    </Typography>
                    <Slider
                      value={pageRange}
                      onChange={handlePageRangeChange}
                      valueLabelDisplay="auto"
                      min={1}
                      max={totalPages}
                      marks
                      sx={{ mt: 2 }}
                    />
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }}>
                <Chip label="OR" />
              </Divider>
              
              <TextField
                fullWidth
                label="Content Text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                required={!pdfFile}
                multiline
                rows={6}
                inputProps={{ maxLength: 1000 }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
                placeholder="Enter the content from which questions will be generated (max 1000 words)..."
                disabled={!!pdfFile}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {formData.text.length} / 1000 characters
              </Typography>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2} timeout={500}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SettingsIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" color="primary">Question Settings</Typography>
              </Box>
              
              <FormControl 
                fullWidth 
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
              >
                <InputLabel>Question Type</InputLabel>
                <Select
                  name="question_type"
                  value={formData.question_type}
                  onChange={handleChange}
                  label="Question Type"
                >
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="true_false">True/False</MenuItem>
                  <MenuItem value="mix">Mixed</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Number of Questions (1-50)
                </Typography>
                <Slider
                  value={formData.num_questions ?? 10}
                  onChange={handleSliderChange}
                  step={null}
                  marks={questionMarks}
                  min={1}
                  max={50}
                  valueLabelDisplay="auto"
                  sx={{
                    color: formData.num_questions === null ? 'text.disabled' : 'primary.main',
                    '& .MuiSlider-mark': {
                      backgroundColor: '#bfbfbf',
                    },
                    '& .MuiSlider-markActive': {
                      backgroundColor: 'primary.main',
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.5,
                      backgroundColor: '#bfbfbf',
                    },
                  }}
                />
                <Typography 
                  variant="caption" 
                  color={formData.num_questions === null ? "error" : "text.secondary"} 
                  sx={{ mt: 1, display: 'block' }}
                >
                  {formData.num_questions === null 
                    ? "* Please select the number of questions" 
                    : `Current selection: ${formData.num_questions} questions`}
                </Typography>
              </Box>

              {formData.question_type !== 'true_false' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    Options per Question
                  </Typography>
                  <Select
                    fullWidth
                    name="num_options"
                    value={formData.num_options}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    <MenuItem value={2}>2 Options</MenuItem>
                    <MenuItem value={3}>3 Options</MenuItem>
                    <MenuItem value={4}>4 Options</MenuItem>
                  </Select>
                </Box>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.include_flashcards ?? false}
                    onChange={handleChange}
                    name="include_flashcards"
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Include Flashcards</Typography>
                    <Tooltip title="Generate flashcards to help with studying the content" arrow>
                      <IconButton size="small">
                        <HelpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                sx={{ mb: 3 }}
              />
            </Box>
          </Fade>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    // Validate based on current step
    if (activeStep === 0 && formData.content_name.trim() === '') {
      toast.error("Please provide a quiz name", { position: "top-center" });
      return;
    }
    
    if (activeStep === 1) {
      if (activeTab === 'text' && formData.text.trim() === '' && !pdfFile) {
        toast.error("Please provide content text or upload a PDF", { position: "top-center" });
        return;
      }
    }
    
    if (activeStep === 2) {
      if (formData.num_questions === null) {
        toast.error("Please select the number of questions", { position: "top-center" });
        return;
      }
      
      if (formData.include_flashcards === null) {
        toast.error("Please specify whether to include flashcards", { position: "top-center" });
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container maxWidth="md">
      <Fade in={mounted}>
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CreateIcon sx={{ mr: 2 }} />
              <Typography variant="h4" component="h1">
                Create New Quiz
              </Typography>
            </Box>

            {/* Subscription Status with Debug Info */}
            <Box 
              sx={{ 
                mb: 3, 
                p: 2, 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default'
              }}
            >
              {subscriptionStatus === 'free' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Free Plan
                    </Typography>
                    <Typography variant="body2" color={remainingFree < 3 ? "error" : "text.secondary"}>
                      {remainingFree} generation{remainingFree !== 1 ? 's' : ''} remaining
                    </Typography>
                  </Box>
                  {remainingFree < 5 && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component={Link} 
                      to="/subscription"
                      size="small"
                    >
                      Upgrade Now
                    </Button>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)} Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unlimited generations
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<BackIcon />}
                  sx={{ 
                    borderRadius: 30,
                    px: 3,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  Back
                </Button>
                
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      endIcon={loading ? undefined : <SendIcon />}
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
                        }
                      }}
                      className="btn-ripple"
                    >
                      {loading ? <CircularProgress size={24} /> : 'Create Quiz Now'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<QuestionIcon />}
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
                        }
                      }}
                      className="btn-ripple"
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </form>

            {/* Subscription Dialog */}
            <Dialog open={showSubscriptionDialog} onClose={() => setShowSubscriptionDialog(false)}>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon color="warning" sx={{ mr: 1 }} />
                  Generation Limit Reached
                </Box>
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" paragraph>
                  You've used all your free generations. Subscribe to a premium plan to continue creating quizzes.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Premium plans include:
                </Typography>
                <ul>
                  <li>Unlimited quiz generations</li>
                  <li>Priority support</li>
                  <li>Advanced features</li>
                </ul>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowSubscriptionDialog(false)} color="inherit">
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  component={Link}
                  to="/subscription"
                  onClick={() => setShowSubscriptionDialog(false)}
                >
                  View Plans
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default CreateQuiz; 