import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

export const useClerkToken = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const updateToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          localStorage.setItem('clerk-token', token);
        } else {
          localStorage.removeItem('clerk-token');
        }
      } catch (error) {
        console.error('Error updating token:', error);
        localStorage.removeItem('clerk-token');
      }
    };

    updateToken();
  }, [getToken]);
}; 