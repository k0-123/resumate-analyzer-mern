import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type { DashboardStats } from '@/types';

interface DashboardProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const Dashboard = ({ stats, isLoading, onRefresh }: DashboardProps) => {
  useEffect(() => {
    onRefresh();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">No dashboard data available</p>
        </div>
      </section>
    );
  }

  const { totalResumes, totalAnalyses, averageScore, improvementTrend, recentAnalyses, scoreHistory } = stats;

  const statCards = [
    {
      title: 'Total Resumes',
      value: totalResumes,
      icon: FileText,
      color: 'cyan',
      trend: null,
    },
    {
      title: 'Total Analyses',
      value: totalAnalyses,
      icon: BarChart3,
      color: 'purple',
      trend: null,
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: Award,
      color: 'green',
      trend: improvementTrend,
    },
  ];

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return null;
  };

  const chartData = scoreHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score,
  }));

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Your <span className="text-gradient">Dashboard</span>
            </h2>
            <p className="text-gray-400">Track your resume improvement journey</p>
          </div>
          <button
            onClick={onRefresh}
            className="btn-secondary flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Refresh
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                {stat.trend !== null && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={stat.trend >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Score Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Score History</h3>
                <p className="text-gray-500 text-sm">Your resume scores over time</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={12}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 30, 45, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Recent Analyses</h3>
              <p className="text-gray-500 text-sm">Your latest resume checks</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          {recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.map((analysis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium truncate max-w-xs">
                        {analysis.resumeName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(analysis.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-bold ${
                      analysis.score >= 80 ? 'text-green-400' :
                      analysis.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {analysis.score}
                    </span>
                    <span className="text-gray-500">/100</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No analyses yet. Upload your first resume!</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Dashboard;
