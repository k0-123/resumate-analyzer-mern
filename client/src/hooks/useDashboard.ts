import { useState, useCallback } from 'react';
import type { DashboardStats } from '@/types';
import { analysisAPI } from '@/services/api';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analysisAPI.getDashboard();
      setStats(response.data.data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    stats,
    isLoading,
    error,
    fetchDashboard,
    clearError,
  };
};
