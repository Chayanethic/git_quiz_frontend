import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
  Paper,
  Badge,
  Tooltip,
  CircularProgress,
  ListItemButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Create as CreateIcon,
  History as HistoryIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  AccountCircle as ProfileIcon,
  Star as StarIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const location = useLocation();
  const { isAuthenticated, userId, userName } = useAuth();
  const { 
    remainingFree, 
    subscriptionStatus, 
    subscriptionExpiry,
    refreshSubscription
  } = useSubscription();

  // Refresh subscription data when sidebar loads
  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshSubscription();
    }
  }, [isAuthenticated, userId]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Format subscription expiry date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  };

  // Determine the display text for the subscription status
  const getSubscriptionDisplay = () => {
    if (subscriptionStatus === 'free') {
      return (
        <>
          <Typography variant="subtitle2" fontWeight="bold">
            Free Plan
          </Typography>
          <Typography 
            variant="body2" 
            color={remainingFree < 3 ? "error" : "text.secondary"}
          >
            {remainingFree} generation{remainingFree !== 1 ? 's' : ''} left
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <Typography variant="subtitle2" fontWeight="bold">
            {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)} Plan
          </Typography>
          <Typography variant="body2">
            Expires: {formatDate(subscriptionExpiry)}
          </Typography>
        </>
      );
    }
  };

  const menuItems = [
    { path: '/home', text: 'Home', icon: <HomeIcon /> },
    { path: '/create', text: 'Create Quiz', icon: <CreateIcon /> },
    { path: '/mock-test', text: 'Mock Tests', icon: <QuizIcon /> },
    { path: '/recent', text: 'Recent Quizzes', icon: <HistoryIcon /> },
    { path: '/about', text: 'About', icon: <InfoIcon /> },
  ];

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        width: isOpen ? 240 : 70,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
      }}
    >
      {/* Logo and Title */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'flex-start' : 'center',
        }}
      >
        <SchoolIcon fontSize="large" color="primary" />
        {isOpen && (
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 1, fontWeight: 'bold' }}
          >
            Git Quiz
          </Typography>
        )}
      </Box>

      <Divider />

      {/* User info and subscription status */}
      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          {isOpen ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ProfileIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" noWrap>
                  {userName || 'User'}
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: remainingFree < 3 && subscriptionStatus === 'free' ? 'warning.main' : 'divider',
                }}
              >
                {getSubscriptionDisplay()}
                {subscriptionStatus === 'free' && remainingFree < 5 && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    component={Link}
                    to="/subscription"
                  >
                    Upgrade
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <Tooltip title={`${subscriptionStatus === 'free' ? `${remainingFree} generations left` : `${subscriptionStatus} plan`}`} placement="right">
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {subscriptionStatus === 'free' ? (
                  <Badge
                    badgeContent={remainingFree}
                    color={remainingFree < 3 ? "error" : "primary"}
                  >
                    <StarIcon color={subscriptionStatus === 'free' && remainingFree < 3 ? "error" : "inherit"} />
                  </Badge>
                ) : (
                  <StarIcon color="primary" />
                )}
              </Box>
            </Tooltip>
          )}
        </Box>
      )}

      <Divider />

      {/* Navigation menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            component={Link}
            to={item.path}
            key={item.path}
            sx={{
              py: 1.5,
              minHeight: 48,
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              bgcolor: isActive(item.path) ? 'action.selected' : undefined,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 2 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {isOpen && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
        
        {/* Add subscription link to menu */}
        <ListItemButton
          component={Link}
          to="/subscription"
          sx={{
            py: 1.5,
            minHeight: 48,
            justifyContent: isOpen ? 'initial' : 'center',
            px: 2.5,
            bgcolor: isActive('/subscription') ? 'action.selected' : undefined,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isOpen ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            <StarIcon color={subscriptionStatus === 'free' && remainingFree < 3 ? "error" : "inherit"} />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Subscription" />}
        </ListItemButton>
      </List>

      <Divider />

      {/* Footer with upgrade button or settings */}
      <Box sx={{ p: 2 }}>
        {isOpen ? (
          subscriptionStatus === 'free' && (
            <Button
              variant="contained"
              fullWidth
              component={Link}
              to="/subscription"
              startIcon={<StarIcon />}
              color={remainingFree < 3 ? "warning" : "primary"}
              sx={{ mb: 1 }}
            >
              Upgrade Plan
            </Button>
          )
        ) : (
          <Tooltip title="Settings" placement="right">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <SettingsIcon />
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar; 