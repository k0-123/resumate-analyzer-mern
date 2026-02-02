import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import confetti from 'canvas-confetti';

interface ATSScoreProps {
  analysisResult: AnalysisResult | null;
}

const ATSScore = ({ analysisResult }: ATSScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (analysisResult) {
      const duration = 1500;
      const steps = 60;
      const increment = analysisResult.overallScore / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= analysisResult.overallScore) {
          setAnimatedScore(analysisResult.overallScore);
          clearInterval(timer);
          
          // Trigger confetti for high scores
          if (analysisResult.overallScore >= 80) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981'],
            });
          }
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [analysisResult]);

  if (!analysisResult) return null;

  const { overallScore, sectionScores, keywordMatch } = analysisResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#facc15';
    return '#f87171';
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const sectionItems = [
    { label: 'Skills', score: sectionScores.skills, icon: Zap },
    { label: 'Experience', score: sectionScores.experience, icon: TrendingUp },
    { label: 'Projects', score: sectionScores.projects, icon: Target },
    { label: 'Education', score: sectionScores.education, icon: Award },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your <span className="text-gradient">ATS Score</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Based on our analysis of your resume against industry standards and job requirements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Score Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center"
          >
            <div className="relative">
              <svg width="280" height="280" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke={getScoreStroke(animatedScore)}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="progress-ring-circle"
                  style={{
                    filter: `drop-shadow(0 0 10px ${getScoreStroke(animatedScore)})`,
                  }}
                />
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className={`text-6xl font-bold ${getScoreColor(animatedScore)}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {animatedScore}
                </motion.span>
                <span className="text-gray-500 text-sm mt-1">out of 100</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className={`text-lg font-medium ${getScoreColor(animatedScore)}`}>
                {overallScore >= 80 ? 'Excellent!' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </span>
              <p className="text-gray-400 text-sm mt-1">
                {overallScore >= 80 
                  ? 'Your resume is ATS-optimized!' 
                  : overallScore >= 60 
                    ? 'Some improvements can help you stand out.' 
                    : 'Significant improvements recommended.'}
              </p>
            </div>
          </motion.div>

          {/* Section Scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Section Breakdown</h3>
            
            {sectionItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass-card rounded-2xl p-4 hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${getScoreColor(item.score)}`}>
                    {item.score}%
                  </span>
                </div>
                
                <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${getScoreStroke(item.score)}, ${getScoreStroke(Math.min(item.score + 20, 100))})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}

            {/* Keyword Match */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Keyword Match</span>
                <span className={`text-lg font-bold ${getScoreColor(keywordMatch.percentage)}`}>
                  {keywordMatch.percentage}%
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {keywordMatch.matched.length} of {keywordMatch.matched.length + keywordMatch.missing.length} keywords matched
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ATSScore;
