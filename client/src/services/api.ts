import axios, { type AxiosInstance, type AxiosError } from 'axios';

 
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  updateProfile: (name: string) =>
    api.put('/auth/profile', { name }),
};

// Resume API
export const resumeAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getAll: () =>
    api.get('/resume'),
  
  getById: (id: string) =>
    api.get(`/resume/${id}`),
  
  delete: (id: string) =>
    api.delete(`/resume/${id}`),
  
  getAnalysis: (id: string) =>
    api.get(`/resume/${id}/analysis`),
};

// Analysis API
export const analysisAPI = {
  analyzeResume: (resumeId: string) =>
    api.post(`/analysis/resume/${resumeId}`),
  
  compareWithJD: (resumeId: string, jdText?: string, jdId?: string) =>
    api.post('/analysis/compare', { resumeId, jdText, jdId }),
  
  saveJD: (title: string, company: string, rawText: string) =>
    api.post('/analysis/jd', { title, company, rawText }),
  
  getAllJDs: () =>
    api.get('/analysis/jd'),
  
  getJDById: (id: string) =>
    api.get(`/analysis/jd/${id}`),
  
  deleteJD: (id: string) =>
    api.delete(`/analysis/jd/${id}`),
  
  getDashboard: () =>
    api.get('/analysis/dashboard'),
};

export default api;
