import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  RefreshCw, 
  TrendingDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { AnalysisResult } from '@/types';

interface FeedbackCardsProps {
  analysisResult: AnalysisResult | null;
}

const FeedbackCards = ({ analysisResult }: FeedbackCardsProps) => {
  if (!analysisResult) return null;

  const { feedback, keywordMatch } = analysisResult;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  const feedbackCategories = [
    {
      title: 'Missing Skills',
      icon: XCircle,
      color: 'red',
      items: feedback.missingSkills,
      description: 'Add these skills to improve your match',
    },
    {
      title: 'Weak Sections',
      icon: TrendingDown,
      color: 'yellow',
      items: feedback.weakSections,
      description: 'These sections need improvement',
    },
    {
      title: 'Strong Points',
      icon: CheckCircle,
      color: 'green',
      items: feedback.strongPoints,
      description: 'These are your resume strengths',
    },
    {
      title: 'Overused Buzzwords',
      icon: AlertTriangle,
      color: 'orange',
      items: feedback.overusedBuzzwords,
      description: 'Replace with specific achievements',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: 'text-red-400',
      },
      yellow: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: 'text-yellow-400',
      },
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: 'text-green-400',
      },
      orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        icon: 'text-orange-400',
      },
    };
    return colors[color] || colors.red;
  };

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
            Smart <span className="text-gradient">Feedback</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Actionable insights to help you improve your resume and beat the ATS.
          </p>
        </motion.div>

        {/* Feedback Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {feedbackCategories.map((category, index) => {
            const colors = getColorClasses(category.color);
            const hasItems = category.items.length > 0;

            return (
              <motion.div
                key={category.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`glass-card rounded-2xl p-6 hover-lift ${
                  hasItems ? '' : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{category.title}</h3>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                  <span className={`ml-auto text-lg font-bold ${colors.text}`}>
                    {category.items.length}
                  </span>
                </div>

                {hasItems ? (
                  <div className="flex flex-wrap gap-2">
                    {category.items.slice(0, 6).map((item, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {item}
                      </span>
                    ))}
                    {category.items.length > 6 && (
                      <span className={`px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text}`}>
                        +{category.items.length - 6} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No issues found</p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Personalized Suggestions</h3>
              <p className="text-gray-500 text-sm">Based on our ATS analysis</p>
            </div>
          </div>

          <div className="space-y-4">
            {feedback.suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">{suggestion}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Keyword Analysis */}
        {keywordMatch.matched.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 glass-card rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Keyword Analysis</h3>
                <p className="text-gray-500 text-sm">Skills matched from job description</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywordMatch.matched.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-medium"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeedbackCards;
