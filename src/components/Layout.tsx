import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { refreshSubscription } = useSubscription();
  const { isAuthenticated } = useAuth();

  // Refresh subscription data when layout mounts
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Layout mounted - refreshing subscription data');
      refreshSubscription();
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: sidebarOpen ? '240px' : '70px',
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease',
          position: 'relative',
        }}
      >
        {/* Toggle button */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            left: sidebarOpen ? '244px' : '74px',
            top: '10px',
            zIndex: 1100,
            bgcolor: 'background.paper',
            boxShadow: 1,
            transition: 'left 0.2s ease',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          size="small"
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        
        {/* Page content */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 