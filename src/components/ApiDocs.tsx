import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  CheckCircle as CheckIcon,
  IntegrationInstructions as IntegrateIcon,
  Upload as UploadIcon,
  Create as CreateIcon,
  Quiz as QuizIcon,
  Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tabpanel-${index}`}
      aria-labelledby={`api-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const BASE_URL = 'https://git-quiz-server.onrender.com';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const uploadPdfCode = `// Example using FormData
const uploadPdf = async (file, userId, contentName) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('user_id', userId);
  formData.append('content_name', contentName);
  formData.append('num_questions', '10');
  formData.append('num_options', '4');
  formData.append('include_flashcards', 'true');

  const response = await fetch('${BASE_URL}/api/upload_pdf?startPage=1&endPage=5', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
};`;

  const createContentCode = `// Example using fetch
const createContent = async () => {
  const response = await fetch('${BASE_URL}/api/create_content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: "The content to generate questions from...",
      question_type: "multiple_choice",
      num_options: 4,
      num_questions: 5,
      include_flashcards: true,
      content_name: "Physics Notes",
      user_id: "user123"
    }),
  });

  const data = await response.json();
  return data;
};`;

  const getQuizCode = `// Example using fetch
const getQuiz = async (quizId) => {
  const response = await fetch('${BASE_URL}/api/quiz/' + quizId);
  const data = await response.json();
  return data;
};`;

  const getFlashcardsCode = `// Example using fetch
const getFlashcards = async (quizId) => {
  const response = await fetch('${BASE_URL}/api/flashcards/' + quizId);
  const data = await response.json();
  return data;
};`;

  const submitScoreCode = `// Example using fetch
const submitScore = async (quizId, playerName, score) => {
  const response = await fetch('${BASE_URL}/api/submit_score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quizId: quizId,
      playerName: playerName,
      score: score
    }),
  });

  const data = await response.json();
  return data;
};`;

  const getLeaderboardCode = `// Example using fetch
const getLeaderboard = async (quizId) => {
  const response = await fetch('${BASE_URL}/api/leaderboard/' + quizId);
  const data = await response.json();
  return data;
};`;

  const generateMockTestCode = `// Example using fetch
const generateMockTest = async () => {
  const response = await fetch('${BASE_URL}/api/mock-test/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: "Physics - Mechanics",
      description: "Cover Newton's laws of motion, friction, and circular motion",
      difficulty: "medium",
      num_questions: 20,
      user_id: "user123"
    }),
  });

  const data = await response.json();
  // Response includes:
  // {
  //   message: "Mock test generated successfully",
  //   test_id: "MT1234567",
  //   download_link: "/api/mock-test/download/MT1234567",
  //   topic: "Physics - Mechanics",
  //   difficulty: "medium",
  //   num_questions: 20,
  //   subscription_status: "free",
  //   remaining_free: 9
  // }
  return data;
};`;

  const downloadMockTestCode = `// Example using fetch
const downloadMockTest = async (testId) => {
  const response = await fetch('${BASE_URL}/api/mock-test/download/' + testId);
  const blob = await response.blob();
  
  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mock-test.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};`;

  const getUserMockTestsCode = `// Example using fetch
const getUserMockTests = async (userId) => {
  const response = await fetch('${BASE_URL}/api/mock-test/user/' + userId);
  const data = await response.json();
  // Response includes array of:
  // {
  //   test_id: "MT1234567",
  //   topic: "Physics - Mechanics",
  //   difficulty: "medium",
  //   num_questions: 20,
  //   created_at: "2023-06-01T12:00:00.000Z",
  //   download_link: "/api/mock-test/download/MT1234567"
  // }
  return data;
};`;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              mb: 4,
              background: 'linear-gradient(45deg, #2196F3, #00C853)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            <ApiIcon sx={{ fontSize: 45, verticalAlign: 'middle', mr: 2 }} />
            API Documentation
          </Typography>

          <Alert 
            severity="info" 
            sx={{ mb: 4 }}
            icon={<IntegrateIcon />}
          >
            Integrate our powerful Quiz Generation API into your website or application. Base URL: {BASE_URL}
          </Alert>
        </motion.div>

        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Mock Test" 
              icon={<QuizIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Upload PDF" 
              icon={<UploadIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Create Content" 
              icon={<CreateIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Get Quiz" 
              icon={<QuizIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Get Flashcards" 
              icon={<QuizIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Submit Score" 
              icon={<LeaderboardIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Get Leaderboard" 
              icon={<LeaderboardIcon />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Mock Test Tab */}
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h6" gutterBottom>
              Mock Test API Integration
            </Typography>
            <Typography variant="body1" paragraph>
              Generate and manage mock tests with our comprehensive API endpoints.
            </Typography>

            {/* Generate Mock Test */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom color="primary">
                1. Generate Mock Test
              </Typography>
              <Typography variant="body2" paragraph>
                Create a new mock test with custom parameters.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Endpoint
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip 
                      label="POST" 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 2 }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'grey.300',
                        flex: 1,
                        fontFamily: 'monospace'
                      }}
                    >
                      /api/mock-test/generate
                    </Typography>
                    <Tooltip title="Copy endpoint">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyCode('/api/mock-test/generate')}
                        sx={{ color: 'grey.300' }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Example Code
              </Typography>
              <Paper sx={{ position: 'relative' }}>
                <SyntaxHighlighter
                  language="javascript"
                  style={materialDark}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    borderRadius: '4px',
                  }}
                >
                  {generateMockTestCode}
                </SyntaxHighlighter>
                <IconButton
                  onClick={() => handleCopyCode(generateMockTestCode)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'grey.300',
                  }}
                >
                  <CopyIcon />
                </IconButton>
              </Paper>
            </Box>

            {/* Download Mock Test */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom color="primary">
                2. Download Mock Test
              </Typography>
              <Typography variant="body2" paragraph>
                Download a generated mock test as PDF.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Endpoint
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip 
                      label="GET" 
                      color="success" 
                      size="small" 
                      sx={{ mr: 2 }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'grey.300',
                        flex: 1,
                        fontFamily: 'monospace'
                      }}
                    >
                      /api/mock-test/download/:testId
                    </Typography>
                    <Tooltip title="Copy endpoint">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyCode('/api/mock-test/download/:testId')}
                        sx={{ color: 'grey.300' }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Example Code
              </Typography>
              <Paper sx={{ position: 'relative' }}>
                <SyntaxHighlighter
                  language="javascript"
                  style={materialDark}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    borderRadius: '4px',
                  }}
                >
                  {downloadMockTestCode}
                </SyntaxHighlighter>
                <IconButton
                  onClick={() => handleCopyCode(downloadMockTestCode)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'grey.300',
                  }}
                >
                  <CopyIcon />
                </IconButton>
              </Paper>
            </Box>

            {/* Get User's Mock Tests */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom color="primary">
                3. Get User's Mock Tests
              </Typography>
              <Typography variant="body2" paragraph>
                Retrieve all mock tests created by a specific user.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Endpoint
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip 
                      label="GET" 
                      color="success" 
                      size="small" 
                      sx={{ mr: 2 }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'grey.300',
                        flex: 1,
                        fontFamily: 'monospace'
                      }}
                    >
                      /api/mock-test/user/:userId
                    </Typography>
                    <Tooltip title="Copy endpoint">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyCode('/api/mock-test/user/:userId')}
                        sx={{ color: 'grey.300' }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Example Code
              </Typography>
              <Paper sx={{ position: 'relative' }}>
                <SyntaxHighlighter
                  language="javascript"
                  style={materialDark}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    borderRadius: '4px',
                  }}
                >
                  {getUserMockTestsCode}
                </SyntaxHighlighter>
                <IconButton
                  onClick={() => handleCopyCode(getUserMockTestsCode)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'grey.300',
                  }}
                >
                  <CopyIcon />
                </IconButton>
              </Paper>
            </Box>
          </TabPanel>

          {/* Upload PDF Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>
              1. Upload PDF & Generate Questions/Flashcards
            </Typography>
            <Typography variant="body1" paragraph>
              Upload a PDF file and generate questions and flashcards from its content.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endpoint
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label="POST" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 2 }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'grey.300',
                      flex: 1,
                      fontFamily: 'monospace'
                    }}
                  >
                    /api/upload_pdf
                  </Typography>
                  <Tooltip title="Copy endpoint">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyCode('/api/upload_pdf')}
                      sx={{ color: 'grey.300' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Example Code
            </Typography>
            <Paper sx={{ position: 'relative' }}>
              <SyntaxHighlighter
                language="javascript"
                style={materialDark}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                {uploadPdfCode}
              </SyntaxHighlighter>
              <IconButton
                onClick={() => handleCopyCode(uploadPdfCode)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'grey.300',
                }}
              >
                <CopyIcon />
              </IconButton>
            </Paper>
          </TabPanel>

          {/* Create Content Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              2. Create Quiz/Flashcards from Text
            </Typography>
            <Typography variant="body1" paragraph>
              Generate questions and flashcards from text content.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endpoint
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label="POST" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 2 }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'grey.300',
                      flex: 1,
                      fontFamily: 'monospace'
                    }}
                  >
                    /api/create_content
                  </Typography>
                  <Tooltip title="Copy endpoint">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyCode('/api/create_content')}
                      sx={{ color: 'grey.300' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Example Code
            </Typography>
            <Paper sx={{ position: 'relative' }}>
              <SyntaxHighlighter
                language="javascript"
                style={materialDark}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                {createContentCode}
              </SyntaxHighlighter>
              <IconButton
                onClick={() => handleCopyCode(createContentCode)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'grey.300',
                }}
              >
                <CopyIcon />
              </IconButton>
            </Paper>
          </TabPanel>

          {/* Get Quiz Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>
              3. Get Quiz Data
            </Typography>
            <Typography variant="body1" paragraph>
              Retrieve questions and answers for a specific quiz.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endpoint
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label="GET" 
                    color="success" 
                    size="small" 
                    sx={{ mr: 2 }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'grey.300',
                      flex: 1,
                      fontFamily: 'monospace'
                    }}
                  >
                    /api/quiz/:quizId
                  </Typography>
                  <Tooltip title="Copy endpoint">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyCode('/api/quiz/:quizId')}
                      sx={{ color: 'grey.300' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Example Code
            </Typography>
            <Paper sx={{ position: 'relative' }}>
              <SyntaxHighlighter
                language="javascript"
                style={materialDark}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                {getQuizCode}
              </SyntaxHighlighter>
              <IconButton
                onClick={() => handleCopyCode(getQuizCode)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'grey.300',
                }}
              >
                <CopyIcon />
              </IconButton>
            </Paper>
          </TabPanel>

          {/* Get Flashcards Tab */}
          <TabPanel value={activeTab} index={4}>
            <Typography variant="h6" gutterBottom>
              4. Get Flashcards
            </Typography>
            <Typography variant="body1" paragraph>
              Retrieve flashcards for a specific quiz.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endpoint
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label="GET" 
                    color="success" 
                    size="small" 
                    sx={{ mr: 2 }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'grey.300',
                      flex: 1,
                      fontFamily: 'monospace'
                    }}
                  >
                    /api/flashcards/:quizId
                  </Typography>
                  <Tooltip title="Copy endpoint">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyCode('/api/flashcards/:quizId')}
                      sx={{ color: 'grey.300' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Example Code
            </Typography>
            <Paper sx={{ position: 'relative' }}>
              <SyntaxHighlighter
                language="javascript"
                style={materialDark}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                {getFlashcardsCode}
              </SyntaxHighlighter>
              <IconButton
                onClick={() => handleCopyCode(getFlashcardsCode)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'grey.300',
                }}
              >
                <CopyIcon />
              </IconButton>
            </Paper>
          </TabPanel>

          {/* Submit Score Tab */}
          <TabPanel value={activeTab} index={5}>
            <Typography variant="h6" gutterBottom>
              5. Submit Quiz Score
            </Typography>
            <Typography variant="body1" paragraph>
              Submit a player's score for a quiz.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endpoint
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label="POST" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 2 }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'grey.300',
                      flex: 1,
                      fontFamily: 'monospace'
                    }}
                  >
                    /api/submit_score
                  </Typography>
                  <Tooltip title="Copy endpoint">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyCode('/api/submit_score')}
                      sx={{ color: 'grey.300' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Example Code
            </Typography>
            <Paper sx={{ position: 'relative' }}>
              <SyntaxHighlighter
                language="javascript"
                style={materialDark}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                {submitScoreCode}
              </SyntaxHighlighter>
              <IconButton
                onClick={() => handleCopyCode(submitScoreCode)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'grey.300',
                }}
              >
                <CopyIcon />
              </IconButton>
            </Paper>
          </TabPanel>

          {/* Get Leaderboard Tab */}
          <TabPanel value={activeTab} index={6}>
            <Typography variant="h6" gutterBottom>
              6. Get Quiz Leaderboard
            </Typography>
            <Typography variant="body1" paragraph>
              Retrieve the leaderboard for a specific quiz.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endpoint
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label="GET" 
                    color="success" 
                    size="small" 
                    sx={{ mr: 2 }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'grey.300',
                      flex: 1,
                      fontFamily: 'monospace'
                    }}
                  >
                    /api/leaderboard/:quizId
                  </Typography>
                  <Tooltip title="Copy endpoint">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyCode('/api/leaderboard/:quizId')}
                      sx={{ color: 'grey.300' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Example Code
            </Typography>
            <Paper sx={{ position: 'relative' }}>
              <SyntaxHighlighter
                language="javascript"
                style={materialDark}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                {getLeaderboardCode}
              </SyntaxHighlighter>
              <IconButton
                onClick={() => handleCopyCode(getLeaderboardCode)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'grey.300',
                }}
              >
                <CopyIcon />
              </IconButton>
            </Paper>
          </TabPanel>
        </Paper>

        <Snackbar
          open={copySuccess}
          autoHideDuration={2000}
          onClose={() => setCopySuccess(false)}
          message="Code copied to clipboard!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
};

export default ApiDocs; 