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
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-7 hover:from-white/15 hover:to-white/10 hover:border-white/40 transition-all duration-300 h-full group-hover:shadow-2xl group-hover:shadow-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold ${
                stat.trend === 'up' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                <span>{stat.change}</span>
                <TrendingUp className={`w-4 h-4 ${
                  stat.trend === 'down' ? 'rotate-180' : ''
                }`} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-2">{stat.value}</h3>
            <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardStats;