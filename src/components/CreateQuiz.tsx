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
} from '@mui/icons-material';
import { api } from '../services/api';

interface CreateQuizResponse {
  quiz_id: string;
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageRange, setPageRange] = useState<[number, number]>([1, 1]);
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
    include_flashcards: null,
  });

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = ['Quiz Details', 'Content', 'Question Settings'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only submit if we're on the last step
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    setLoading(true);
    setError('');

    // Validation
    if (!formData.question_type || formData.num_questions === null || formData.include_flashcards === null) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      let response;
      
      if (pdfFile) {
        // Create FormData for file upload
        const formDataObj = new FormData();
        formDataObj.append('pdf', pdfFile);
        formDataObj.append('startPage', pageRange[0].toString());
        formDataObj.append('endPage', pageRange[1].toString());
        formDataObj.append('question_type', formData.question_type);
        formDataObj.append('num_options', formData.num_options.toString());
        formDataObj.append('num_questions', Math.min(Math.max(formData.num_questions, 1), 50).toString()); // Ensure between 1 and 50
        formDataObj.append('include_flashcards', formData.include_flashcards!.toString());
        formDataObj.append('content_name', formData.content_name);
        formDataObj.append('user_id', user!.id);

        // Make the request and wait for response
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/upload_pdf`, {
          method: 'POST',
          body: formDataObj
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload PDF');
        }

        response = await uploadResponse.json();
      } else {
        // Validate text content is provided if no PDF
        if (!formData.text.trim()) {
          setError('Please provide either a PDF file or enter text content.');
          setLoading(false);
          return;
        }
        
        // Ensure number of questions is within limits for text input as well
        const validatedFormData = {
          ...formData,
          num_questions: Math.min(Math.max(formData.num_questions!, 1), 50)
        };
        
        response = await api.createQuiz({ ...validatedFormData, user_id: user!.id });
      }

      // Check if we have a valid response with quiz_id
      if (!response || !response.quiz_id) {
        console.error('Invalid response:', response);
        throw new Error('No quiz ID received from server');
      }
      
      navigate(`/quiz/${response.quiz_id}`);
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to create quiz. Please try again.');
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
                    color: 'primary.main',
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
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Select the number of questions for your quiz (default: 10)
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
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          py: 4,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="shadow-lg"
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
          
          <Typography 
            variant="h4" 
            gutterBottom 
            color="primary" 
            align="center"
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create New Quiz
          </Typography>

          {error && (
            <Zoom in={!!error}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </Zoom>
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
                    {loading ? <CircularProgress size={24} /> : 'Create Quiz'}
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
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateQuiz; 