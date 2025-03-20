import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface SubscriptionContextType {
  remainingFree: number;
  subscriptionStatus: 'free' | 'monthly' | 'quarterly' | 'yearly';
  subscriptionExpiry: Date | null;
  canGenerate: boolean;
  refreshSubscription: () => Promise<void>;
  subscribeToPlan: (plan: 'monthly' | 'quarterly' | 'yearly', paymentProof?: File, transactionId?: string) => Promise<void>;
  setRemainingFreeCount: (count: number) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isAuthenticated } = useAuth();
  const [remainingFree, setRemainingFree] = useState<number>(10);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'monthly' | 'quarterly' | 'yearly'>('free');
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(null);
  const [canGenerate, setCanGenerate] = useState<boolean>(true);
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  // Direct setter for remaining free count (for immediate UI updates)
  const setRemainingFreeCount = (count: number) => {
    console.log('Directly setting remaining free count to:', count);
    setRemainingFree(count);
    setCanGenerate(subscriptionStatus !== 'free' || count > 0);
  };

  const refreshSubscription = async () => {
    if (!isAuthenticated || !userId) return;
    
    try {
      // Add cache-busting timestamp to force a fresh request
      const timestamp = new Date().getTime();
      // Only refresh if it's been more than 2 seconds since last refresh to avoid excessive calls
      if (timestamp - lastRefresh < 2000) {
        console.log('Skipping refresh - too soon since last refresh');
        return;
      }
      
      setLastRefresh(timestamp);
      
      // Add a small delay to ensure the backend has time to update database
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await api.getUserSubscription(userId);
      
      console.log('Raw subscription data:', data);
      
      setRemainingFree(data.free_generations_remaining);
      setSubscriptionStatus(data.subscription_status as any);
      setSubscriptionExpiry(data.subscription_expiry ? new Date(data.subscription_expiry) : null);
      
      // Can generate if user has remaining free generations or active subscription
      setCanGenerate(
        data.subscription_status !== 'free' || 
        data.free_generations_remaining > 0
      );
      
      console.log('Subscription refreshed:', {
        free: data.free_generations_remaining,
        status: data.subscription_status,
        expiry: data.subscription_expiry
      });
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  // Subscribe user to a plan
  const subscribeToPlan = async (plan: 'monthly' | 'quarterly' | 'yearly', paymentProof?: File, transactionId?: string) => {
    if (!isAuthenticated || !userId) {
      throw new Error('User not authenticated');
    }
    
    try {
      // In a real implementation, upload the payment proof first
      if (paymentProof && transactionId) {
        // Upload the payment proof and get verification status
        await api.uploadPaymentProof(userId, plan, paymentProof, transactionId);
      }
      
      // Subscribe to the plan (in a real implementation, this would be pending verification)
      await api.subscribeToPlan(userId, plan);
      await refreshSubscription();
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      throw error;
    }
  };

  // Fetch subscription data when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshSubscription();
    }
  }, [isAuthenticated, userId]);

  return (
    <SubscriptionContext.Provider 
      value={{ 
        remainingFree, 
        subscriptionStatus, 
        subscriptionExpiry, 
        canGenerate,
        refreshSubscription,
        subscribeToPlan,
        setRemainingFreeCount
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 