import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Zoom,
  Fade,
  Grow,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  Payment as PaymentIcon,
  Bolt as BoltIcon,
  Diamond as DiamondIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Subscription = () => {
  const theme = useTheme();
  const { subscribeToPlan, subscriptionStatus, remainingFree } = useSubscription();
  
  // Payment dialog states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'yearly' | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  // UPI payment details
  const upiId = "ankitraj9905680581@okaxis";
  const upiName = "Ankit Raj";
  
  // Function to get UPI link with correct amount based on plan
  const getUpiLink = (plan: string): string => {
    let amount = "100.00"; // Default monthly plan
    
    if (plan === 'quarterly') {
      amount = "250.00";
    } else if (plan === 'yearly') {
      amount = "899.00";
    }
    
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&aid=uGICAgMCe2JaNCA`;
  };
  
  // Payment steps
  const paymentSteps = [
    'Scan QR Code',
    'Complete Payment',
    'Upload Proof',
    'Verification'
  ];

  const plans = [
    {
      name: 'Monthly',
      price: '₹100',
      period: 'month',
      icon: <BoltIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3',
      features: [
        'Unlimited quiz generations',
        'Priority support',
        'Access to all features',
        'Cancel anytime',
      ],
    },
    {
      name: 'Quarterly',
      price: '₹250',
      period: 'quarter',
      icon: <DiamondIcon sx={{ fontSize: 40 }} />,
      color: '#9C27B0',
      features: [
        'Unlimited quiz generations',
        'Priority support',
        'Access to all features',
        'Save 17% compared to monthly',
      ],
    },
    {
      name: 'Yearly',
      price: '₹899',
      period: 'year',
      icon: <RocketIcon sx={{ fontSize: 40 }} />,
      color: '#F50057',
      features: [
        'Unlimited quiz generations',
        'Priority support',
        'Access to all features',
        'Save 25% compared to monthly',
      ],
    },
  ];

  const handleSubscribe = async (plan: 'monthly' | 'quarterly' | 'yearly') => {
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
    setActiveStep(0);
    setSubmitted(false);
    setPaymentProof(null);
    setTransactionId('');
    setError('');
  };
  
  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmitPayment = async () => {
    // Validate inputs
    if (!paymentProof) {
      setError('Please upload a payment proof');
      return;
    }
    
    if (!transactionId.trim()) {
      setError('Please provide the transaction ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the API with payment proof and transaction ID
      if (selectedPlan) {
        await subscribeToPlan(selectedPlan, paymentProof, transactionId);
      }
      
      setSubmitted(true);
      setActiveStep(3); // Move to verification step
      toast.success("Payment verification submitted successfully!", { position: "top-center" });
      
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Scan QR code
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scan this QR code to pay
            </Typography>
            
            <Box sx={{ 
              border: '2px dashed', 
              borderColor: 'primary.main', 
              p: 3, 
              borderRadius: 2,
              mb: 2
            }}>
              <QRCodeSVG 
                value={getUpiLink(selectedPlan || 'monthly')} 
                size={200} 
                level="H" 
                includeMargin={true}
              />
            </Box>
            
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold' }}>
              {selectedPlan && (
                `Amount: ₹${selectedPlan === 'monthly' ? '100' : selectedPlan === 'quarterly' ? '250' : '899'}`
              )}
            </Typography>
            
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
              UPI ID: {upiId}<br />
              Name: {upiName}<br />
              Plan: {selectedPlan && selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              After scanning, proceed to the next step
            </Typography>
          </Box>
        );
      case 1: // Complete payment
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1" paragraph>
              Please complete the payment of <strong>₹{selectedPlan === 'monthly' ? '100' : selectedPlan === 'quarterly' ? '250' : '899'}</strong> using your UPI app. Make sure to:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary={`Enter exactly ₹${selectedPlan === 'monthly' ? '100' : selectedPlan === 'quarterly' ? '250' : '899'} as the amount`} 
                  secondary="Any other amount may not be processed correctly" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Note down the Transaction ID or reference number" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Take a screenshot of the successful payment" />
              </ListItem>
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Once payment is complete, proceed to the next step
            </Typography>
          </Box>
        );
      case 2: // Upload proof
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1" paragraph>
              Please upload your payment proof for <strong>₹{selectedPlan === 'monthly' ? '100' : selectedPlan === 'quarterly' ? '250' : '899'}</strong> ({selectedPlan?.charAt(0).toUpperCase()}{selectedPlan?.slice(1)} Plan) and provide the transaction ID
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Transaction ID / Reference Number
              </Typography>
              <TextField
                fullWidth
                label="Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                placeholder="e.g. UPI/123456789/12345"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Proof (Screenshot/Photo)
              </Typography>
              <Box sx={{ 
                border: '2px dashed', 
                borderColor: 'primary.main', 
                p: 3, 
                borderRadius: 2,
                mb: 2,
                textAlign: 'center'
              }}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePaymentProofUpload}
                  style={{ display: 'none' }}
                  id="payment-proof-upload"
                />
                <label htmlFor="payment-proof-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Proof
                  </Button>
                </label>
                
                {paymentProof && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="primary">
                      File selected: {paymentProof.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        );
      case 3: // Verification
        return (
          <Box sx={{ my: 3, textAlign: 'center' }}>
            {submitted ? (
              <>
                <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom color="success.main">
                  Payment Verification Submitted!
                </Typography>
                <Typography variant="body1" paragraph>
                  Thank you for your payment of <strong>₹{selectedPlan === 'monthly' ? '100' : selectedPlan === 'quarterly' ? '250' : '899'}</strong> for the {selectedPlan?.charAt(0).toUpperCase()}{selectedPlan?.slice(1)} Plan.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We are reviewing your payment proof. Your subscription will be updated soon.
                </Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID: {transactionId}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    File: {paymentProof?.name}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <CircularProgress size={50} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Processing Your Submission
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we process your information...
                </Typography>
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Fade in timeout={1000}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              mb: 6,
              background: 'linear-gradient(45deg, #2196F3, #F50057)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Upgrade Your Experience
          </Typography>
        </Fade>

        {/* Current Plan Status */}
        <Zoom in timeout={800}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              mb: 6,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon sx={{ mr: 2, fontSize: 40 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {subscriptionStatus === 'free'
                  ? `Free Plan - ${remainingFree} generations remaining`
                  : `${subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)} Plan`}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {subscriptionStatus === 'free'
                ? 'Upgrade to unlock unlimited quiz generations and premium features'
                : 'You are currently on a premium plan'}
            </Typography>
          </Paper>
        </Zoom>

        {/* Subscription Plans */}
        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grow
              in
              timeout={(index + 1) * 500}
              key={plan.name}
            >
              <Grid item xs={12} md={4}>
                <Card
                  component={motion.div}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: theme.shadows[10],
                  }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: plan.color,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      mb: 3 
                    }}>
                      <Box sx={{ 
                        color: plan.color,
                        mb: 2,
                      }}>
                        {plan.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        align="center"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="h3"
                        component="div"
                        align="center"
                        sx={{ 
                          color: plan.color,
                          fontWeight: 'bold',
                        }}
                        gutterBottom
                      >
                        {plan.price}
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          /{plan.period}
                        </Typography>
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <List>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <CheckIcon sx={{ color: plan.color }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontWeight: 500,
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() =>
                        handleSubscribe(
                          plan.name.toLowerCase() as 'monthly' | 'quarterly' | 'yearly'
                        )
                      }
                      disabled={subscriptionStatus === plan.name.toLowerCase()}
                      sx={{
                        bgcolor: plan.color,
                        '&:hover': {
                          bgcolor: plan.color,
                          filter: 'brightness(0.9)',
                        },
                        height: '48px',
                        borderRadius: '24px',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                      }}
                    >
                      {subscriptionStatus === plan.name.toLowerCase()
                        ? 'Current Plan'
                        : 'Subscribe Now'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>

        {/* Features Comparison */}
        <Box sx={{ mt: 8 }}>
          <Fade in timeout={1000}>
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 4,
              }}
            >
              Compare Features
            </Typography>
          </Fade>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={800}>
                <Paper 
                  elevation={4}
                  sx={{ 
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    background: '#f5f5f5',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                      mb: 3,
                    }}
                  >
                    Free Plan
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="10 quiz generations"
                        secondary="Perfect for trying out the platform"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Basic features"
                        secondary="Essential quiz creation tools"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    },
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'white',
                      mb: 3,
                    }}
                  >
                    Premium Plans
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Unlimited quiz generations"
                        secondary="Create as many quizzes as you need"
                        sx={{
                          '& .MuiListItemText-secondary': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Priority support"
                        secondary="Get help when you need it most"
                        sx={{
                          '& .MuiListItemText-secondary': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Access to all features"
                        secondary="Unlock the full potential"
                        sx={{
                          '& .MuiListItemText-secondary': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                        }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Box>

        {/* Payment Dialog */}
        <Dialog 
          open={paymentDialogOpen} 
          onClose={() => !loading && setPaymentDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon sx={{ mr: 1 }} />
                Payment Process
              </Box>
              {!loading && (
                <Button
                  onClick={() => setPaymentDialogOpen(false)}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <CloseIcon />
                </Button>
              )}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
              {paymentSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {getStepContent(activeStep)}
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            {activeStep < 3 && (
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            )}
            
            {activeStep < 2 ? (
              <Button 
                variant="contained" 
                onClick={handleNext}
              >
                Next
              </Button>
            ) : activeStep === 2 ? (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSubmitPayment}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Verification'}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setPaymentDialogOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Subscription; 