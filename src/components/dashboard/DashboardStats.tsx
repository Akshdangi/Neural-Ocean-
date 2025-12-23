/* eslint-disable no-empty-pattern */
import { motion } from 'framer-motion';
import { Fish, Dna, Globe, TrendingUp, AlertTriangle, Database } from 'lucide-react';

interface StatsProps {
  filters: {
    timeRange: string;
    location: string;
    dataType: string;
  };
}

function DashboardStats({ }: StatsProps) {
  const stats = [
    {
      title: 'Active Fish Stocks',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: <Fish className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'eDNA Samples',
      value: '8,432',
      change: '+28%',
      trend: 'up',
      icon: <Dna className="w-6 h-6" />,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Ocean Zones',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: <Globe className="w-6 h-6" />,
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Biodiversity Index',
      value: '87.3',
      change: '-2%',
      trend: 'down',
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Risk Alerts',
      value: '23',
      change: '+15%',
      trend: 'up',
      icon: <AlertTriangle className="w-6 h-6" />,
      gradient: 'from-red-500 to-pink-500'
    },
    {
      title: 'Data Points',
      value: '2.4M',
      change: '+45%',
      trend: 'up',
      icon: <Database className="w-6 h-6" />,
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-lg`}>
              {stat.icon}
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{stat.change}</span>
              <TrendingUp className={`w-4 h-4 ${
                stat.trend === 'down' ? 'rotate-180' : ''
              }`} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
          <p className="text-gray-400">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardStats;