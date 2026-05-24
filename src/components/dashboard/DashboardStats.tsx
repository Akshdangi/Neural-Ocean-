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
          <div className="absolute inset-0 bg-gradient-to-r from-biolum-teal/5 to-biolum-purple/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative overflow-hidden bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[2rem] p-8 hover:bg-black/40 hover:border-biolum-teal/30 transition-all duration-500 h-full shadow-2xl group-hover:-translate-y-1">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`bg-gradient-to-r ${stat.gradient} p-3.5 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${
                stat.trend === 'up' 
                  ? 'bg-biolum-emerald/10 text-biolum-emerald border border-biolum-emerald/30' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                <span>{stat.change}</span>
                <TrendingUp className={`w-3 h-3 ${
                  stat.trend === 'down' ? 'rotate-180' : ''
                }`} />
              </div>
            </div>
            <h3 className="text-4xl font-black tracking-tighter text-white mb-2 relative z-10">{stat.value}</h3>
            <p className="text-xs tracking-widest uppercase text-gray-500 font-bold relative z-10">{stat.title}</p>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.05] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardStats;