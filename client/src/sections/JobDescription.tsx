import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, Check, AlertCircle } from 'lucide-react';

interface JobDescriptionProps {
  onAnalyze: (jdText: string) => Promise<void>;
  isLoading: boolean;
  hasResume: boolean;
}

const JobDescription = ({ onAnalyze, isLoading, hasResume }: JobDescriptionProps) => {
  const [jdText, setJdText] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!jdText.trim() || jdText.length < 50) {
      setStatus('error');
      return;
    }
    
    setStatus('idle');
    await onAnalyze(jdText);
    setStatus('success');
    setJdText('');
  };

  const sampleJD = `Software Engineer - Full Stack

We are looking for a passionate Software Engineer to join our team. 

Requirements:
- 2+ years of experience with React, Node.js, and TypeScript
- Strong understanding of REST APIs and GraphQL
- Experience with MongoDB and PostgreSQL
- Familiarity with AWS or cloud platforms
- Knowledge of Docker and Kubernetes
- Experience with CI/CD pipelines

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews`;

  const loadSample = () => {
    setJdText(sampleJD);
    setStatus('idle');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Add <span className="text-gradient">Job Description</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Paste the job description to get targeted ATS matching and personalized feedback.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-3xl p-8"
        >
          {!hasResume ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-500">
                Upload a resume first to compare with job descriptions
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">Job Description</span>
                </div>
                <button
                  onClick={loadSample}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Load sample
                </button>
              </div>

              <textarea
                value={jdText}
                onChange={(e) => {
                  setJdText(e.target.value);
                  setStatus('idle');
                }}
                placeholder="Paste the job description here..."
                className="w-full h-64 p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  {jdText.length} characters
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || jdText.length < 50}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5" />
                      Compare with Resume
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">
                    Please enter at least 50 characters
                  </span>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">
                    Analysis complete! Check your results below.
                  </span>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default JobDescription;
