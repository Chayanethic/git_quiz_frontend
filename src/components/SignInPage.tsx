import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box, Container, Typography, Paper } from '@mui/material';

const SignInPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
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
        >
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
            Sign In
          </Typography>
          <SignIn routing="path" path="/sign-in" />
        </Paper>
      </Box>
    </Container>
  );
};

export default SignInPage; 