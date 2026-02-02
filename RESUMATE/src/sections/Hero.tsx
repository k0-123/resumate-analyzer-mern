import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, FileText } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const floatingIcons = [
    { Icon: FileText, delay: 0, x: '10%', y: '20%' },
    { Icon: Zap, delay: 0.5, x: '85%', y: '15%' },
    { Icon: TrendingUp, delay: 1, x: '80%', y: '70%' },
    { Icon: Sparkles, delay: 1.5, x: '15%', y: '75%' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
   
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
    
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      
       
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute hidden lg:block"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.3, 
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: delay + 0.5, duration: 0.5 },
            scale: { delay: delay + 0.5, duration: 0.5 },
            y: { delay: delay + 1, duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Icon className="w-10 h-10 text-cyan-400" />
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
  
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Analyzer</span>
          </span>
        </motion.div>
 
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">Make Your Resume</span>
          <br />
          <span className="text-gradient neon-text-purple">ATS-Proof</span>
          <span className="text-white"> ✨</span>
        </motion.h1>
 
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Stop getting ghosted by ATS systems. Get instant feedback, keyword matching, 
          and data-driven suggestions to land more interviews.
        </motion.p>

      
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 mb-10"
        >
          {[
            { value: '75%', label: 'Resumes Rejected by ATS' },
            { value: '10x', label: 'More Interviews' },
            { value: '30s', label: 'Instant Analysis' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

  
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onGetStarted}
            className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            <Zap className="w-5 h-5" />
            Analyze My Resume
          </button>
          <button
            onClick={onGetStarted}
            className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            <TrendingUp className="w-5 h-5" />
            View Demo
          </button>
        </motion.div>

     
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm"
        >
          <span>Trusted by students from</span>
          <div className="flex gap-4">
            {['Stanford', 'MIT', 'Harvard', 'Georgia Tech'].map((school) => (
              <span key={school} className="font-semibold text-gray-400">
                {school}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

     
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
