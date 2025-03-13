import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    if (userName.trim()) {
      const userId = Math.random().toString(36).substring(2, 15);
      login(userId, userName);
      navigate('/home');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          color="primary"
          align="center"
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          AI Quiz Generator
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          <TextField
            fullWidth
            label="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={!userName.trim()}
          >
            Start Learning
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 