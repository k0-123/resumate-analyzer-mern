import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useResume } from '@/hooks/useResume';
import { useDashboard } from '@/hooks/useDashboard';

// Sections
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import ResumeUpload from '@/sections/ResumeUpload';
import JobDescription from '@/sections/JobDescription';
import ATSScore from '@/sections/ATSScore';
import FeedbackCards from '@/sections/FeedbackCards';
import Dashboard from '@/sections/Dashboard';
import AuthForms from '@/sections/AuthForms';

// Types (unused but kept for future use)
// import type { Resume, AnalysisResult } from '@/types';

function App() {
  // Auth state
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    error: authError,
    login, 
    register, 
    logout,
    clearError 
  } = useAuth();

  // Resume state
  const {
    resumes,
    analysisResult,
    isLoading: resumeLoading,
    error: resumeError,
    uploadResume,
    fetchResumes,
    analyzeResume,
    compareWithJD,
  } = useResume();

  // Dashboard state
  const {
    stats,
    isLoading: dashboardLoading,
    error: dashboardError,
    fetchDashboard,
  } = useDashboard();

  // Navigation state
  const [currentView, setCurrentView] = useState('home');
  const [lastUploadedResumeId, setLastUploadedResumeId] = useState<string | null>(null);

  // Handle errors
  useEffect(() => {
    if (authError) {
      toast.error(authError);
      clearError();
    }
  }, [authError, clearError]);

  useEffect(() => {
    if (resumeError) {
      toast.error(resumeError);
    }
  }, [resumeError]);

  useEffect(() => {
    if (dashboardError) {
      toast.error(dashboardError);
    }
  }, [dashboardError]);

  // Handle resume upload
  const handleUpload = async (file: File) => {
    const result = await uploadResume(file);
    if (result.success && result.resumeId) {
      setLastUploadedResumeId(result.resumeId);
      toast.success('Resume uploaded successfully!');
      // Auto-analyze after upload
      await analyzeResume(result.resumeId);
      return result;
    }
    return result;
  };

  // Handle JD comparison
  const handleJDAnalyze = async (jdText: string) => {
    if (!lastUploadedResumeId && resumes.length === 0) {
      toast.error('Please upload a resume first');
      return;
    }
    const resumeId = lastUploadedResumeId || resumes[0]._id;
    await compareWithJD(resumeId, jdText);
    toast.success('Analysis complete!');
  };

  // Handle navigation
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view === 'dashboard') {
      fetchDashboard();
    } else if (view === 'analyze') {
      fetchResumes();
    }
  };

  // Handle auth
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      setCurrentView('home');
    }
    return result;
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const result = await register(name, email, password);
    if (result.success) {
      toast.success('Account created successfully!');
      setCurrentView('home');
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    setLastUploadedResumeId(null);
    toast.success('Logged out successfully');
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'auth':
        return (
          <AuthForms
            onLogin={handleLogin}
            onRegister={handleRegister}
            isLoading={authLoading}
            error={authError}
          />
        );

      case 'dashboard':
        if (!isAuthenticated) {
          setCurrentView('auth');
          return null;
        }
        return (
          <Dashboard
            stats={stats}
            isLoading={dashboardLoading}
            onRefresh={fetchDashboard}
          />
        );

      case 'analyze':
        if (!isAuthenticated) {
          setCurrentView('auth');
          return null;
        }
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResumeUpload onUpload={handleUpload} isLoading={resumeLoading} />
            <JobDescription
              onAnalyze={handleJDAnalyze}
              isLoading={resumeLoading}
              hasResume={!!lastUploadedResumeId || resumes.length > 0}
            />
            <ATSScore analysisResult={analysisResult} />
            <FeedbackCards analysisResult={analysisResult} />
          </motion.div>
        );

      case 'home':
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onGetStarted={() => {
              if (isAuthenticated) {
                setCurrentView('analyze');
              } else {
                setCurrentView('auth');
              }
            }} />
            
            {isAuthenticated && (
              <>
                <ResumeUpload onUpload={handleUpload} isLoading={resumeLoading} />
                <JobDescription
                  onAnalyze={handleJDAnalyze}
                  isLoading={resumeLoading}
                  hasResume={!!lastUploadedResumeId || resumes.length > 0}
                />
                <ATSScore analysisResult={analysisResult} />
                <FeedbackCards analysisResult={analysisResult} />
              </>
            )}

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Why Choose <span className="text-gradient">ResuMate</span>?
                  </h2>
                  <p className="text-gray-400 max-w-xl mx-auto">
                    The most advanced ATS resume analyzer built for modern job seekers.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'ATS Optimization',
                      description: 'Our algorithm mimics real ATS systems to give you accurate scores.',
                      icon: '🎯',
                    },
                    {
                      title: 'Smart Feedback',
                      description: 'Get actionable suggestions to improve your resume instantly.',
                      icon: '💡',
                    },
                    {
                      title: 'Keyword Matching',
                      description: 'Compare your resume against job descriptions for perfect alignment.',
                      icon: '🔍',
                    },
                    {
                      title: 'Progress Tracking',
                      description: 'Track your improvements over time with detailed analytics.',
                      icon: '📈',
                    },
                    {
                      title: 'Gen-Z Design',
                      description: 'Beautiful, modern interface that makes resume building fun.',
                      icon: '✨',
                    },
                    {
                      title: 'Privacy First',
                      description: 'Your data is encrypted and never shared with third parties.',
                      icon: '🔒',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-2xl p-6 hover-lift text-center"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Join thousands of job seekers who have improved their resumes and landed interviews at top companies.
                </p>
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      setCurrentView('analyze');
                    } else {
                      setCurrentView('auth');
                    }
                  }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Get Started for Free
                </button>
              </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
                      <span className="text-white font-bold">R</span>
                    </div>
                    <span className="text-xl font-bold text-white">ResuMate</span>
                  </div>
                  
                  <div className="flex gap-8 text-sm text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    © 2024 ResuMate. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(30, 30, 45, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          },
        }}
      />
      
      <Navigation
        isAuthenticated={isAuthenticated}
        userName={user?.name || ''}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
