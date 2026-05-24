import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PublicNavigation from '../components/layout/PublicNavigation';
import {
  Waves, Fish, Thermometer, Globe, Anchor,
  TrendingUp, Shield, ArrowRight, Sparkles, Users
} from 'lucide-react';

const oceanStats = [
  { label: 'Marine Species Tracked', value: '12,847', icon: <Fish className="w-7 h-7" />, color: 'cyan' },
  { label: 'Ocean Coverage', value: '71%', icon: <Globe className="w-7 h-7" />, color: 'blue' },
  { label: 'Research Stations', value: '2,340', icon: <Anchor className="w-7 h-7" />, color: 'emerald' },
  { label: 'Active Researchers', value: '15,200', icon: <Users className="w-7 h-7" />, color: 'purple' },
];

const highlights = [
  {
    title: 'Biodiversity Monitoring',
    description: 'Real-time tracking of marine biodiversity across all ocean basins using advanced eDNA sampling and AI classification.',
    icon: <Fish className="w-10 h-10" />,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Ocean Temperature Tracking',
    description: 'Continuous monitoring of sea surface temperatures with predictive models for climate impact assessment.',
    icon: <Thermometer className="w-10 h-10" />,
    gradient: 'from-orange-500 to-red-600',
  },
  {
    title: 'Fish Stock Forecasting',
    description: 'LSTM neural networks predict fisheries stock levels up to 12 months ahead with 85% accuracy.',
    icon: <TrendingUp className="w-10 h-10" />,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Conservation Intelligence',
    description: 'AI-driven risk detection for endangered species and coral reef health monitoring across global waters.',
    icon: <Shield className="w-10 h-10" />,
    gradient: 'from-purple-500 to-indigo-600',
  },
];

function PublicDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] selection:bg-biolum-teal/30 selection:text-biolum-teal">
      <PublicNavigation />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-biolum-teal/10 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-biolum-purple/10 rounded-full blur-[100px] animate-blob delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-center mb-24 relative z-10">
              <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-biolum-teal" />
                <span className="text-gray-300 tracking-widest text-xs uppercase font-bold">Explore the Unknown</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
                Deep <span className="text-transparent bg-clip-text bg-gradient-to-br from-biolum-teal via-biolum-emerald to-biolum-teal">Intelligence</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                An avant-garde approach to oceanographic research. Minimalist interfaces powered by complex AI.
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {oceanStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="relative bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-3xl p-8 text-center hover:bg-black/40 hover:border-biolum-teal/30 transition-all duration-500 group cursor-default shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                <div className="text-biolum-teal mb-6 flex justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter relative z-10">{stat.value}</div>
                <div className="text-xs tracking-widest text-gray-500 uppercase font-bold relative z-10">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i + 0.4, duration: 0.6 }}
                className="relative bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] rounded-3xl p-10 hover:bg-black/40 transition-all duration-700 group hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className={`bg-black/50 border border-white/10 p-5 rounded-2xl w-fit text-biolum-teal mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  {item.icon}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <div className="relative bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] rounded-[3rem] p-16 max-w-4xl mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-biolum-teal/10 via-transparent to-biolum-purple/10 opacity-50" />
              <Waves className="w-16 h-16 text-biolum-teal mx-auto mb-8 relative z-10" />
              <h2 className="text-5xl font-black text-white mb-6 tracking-tighter relative z-10">Access the Core</h2>
              <p className="text-xl text-gray-400 mb-10 font-light max-w-2xl mx-auto relative z-10">
                Sign in to access avant-garde ML models, eDNA sequencing tools, and predictive stock analytics.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="relative z-10 inline-flex items-center gap-4 px-10 py-5 bg-white text-obsidian-900 font-black tracking-widest uppercase text-sm rounded-full hover:bg-biolum-teal hover:text-white transition-all duration-500 hover:scale-105"
              >
                Authenticate <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;
