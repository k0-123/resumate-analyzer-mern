import { useState, useCallback } from 'react';
import type { Resume, AnalysisResult } from '@/types';
import { resumeAPI, analysisAPI } from '@/services/api';

interface UseResumeReturn {
  resumes: Resume[];
  currentResume: Resume | null;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  uploadResume: (file: File) => Promise<{ success: boolean; resumeId?: string; error?: string }>;
  fetchResumes: () => Promise<void>;
  fetchResume: (id: string) => Promise<void>;
  analyzeResume: (resumeId: string) => Promise<void>;
  compareWithJD: (resumeId: string, jdText: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useResume = (): UseResumeReturn => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadResume = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await resumeAPI.upload(file);
      const { resumeId } = response.data.data;
      
      setIsLoading(false);
      return { success: true, resumeId };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to upload resume';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data.data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch resumes');
      setIsLoading(false);
    }
  }, []);

  const fetchResume = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await resumeAPI.getById(id);
      setCurrentResume(response.data.data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch resume');
      setIsLoading(false);
    }
  }, []);

  const analyzeResume = useCallback(async (resumeId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analysisAPI.analyzeResume(resumeId);
      setAnalysisResult(response.data.data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
      setIsLoading(false);
    }
  }, []);

  const compareWithJD = useCallback(async (resumeId: string, jdText: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analysisAPI.compareWithJD(resumeId, jdText);
      setAnalysisResult(response.data.data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to compare with job description');
      setIsLoading(false);
    }
  }, []);

  const deleteResume = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await resumeAPI.delete(id);
      setResumes(prev => prev.filter(r => r._id !== id));
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete resume');
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resumes,
    currentResume,
    analysisResult,
    isLoading,
    error,
    uploadResume,
    fetchResumes,
    fetchResume,
    analyzeResume,
    compareWithJD,
    deleteResume,
    clearError,
  };
};
