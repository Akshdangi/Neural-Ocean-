import { motion } from 'framer-motion';
import PublicNavigation from '../components/layout/PublicNavigation';
import { useNavigate } from 'react-router-dom';
import {
  Thermometer, Droplets, Wind, Waves, Fish,
  TrendingDown, TrendingUp, Globe, ArrowRight, BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from 'recharts';

// Mock ocean temperature data
const temperatureData = [
  { year: '2015', temp: 16.2 }, { year: '2016', temp: 16.5 }, { year: '2017', temp: 16.3 },
  { year: '2018', temp: 16.7 }, { year: '2019', temp: 16.9 }, { year: '2020', temp: 17.0 },
  { year: '2021', temp: 17.1 }, { year: '2022', temp: 17.3 }, { year: '2023', temp: 17.5 },
  { year: '2024', temp: 17.6 },
];

const biodiversityData = [
  { name: 'Fish', value: 35, color: '#06b6d4' },
  { name: 'Invertebrates', value: 28, color: '#3b82f6' },
  { name: 'Mammals', value: 12, color: '#8b5cf6' },
  { name: 'Corals', value: 15, color: '#f59e0b' },
  { name: 'Algae', value: 10, color: '#10b981' },
];

const oceanHealthMetrics = [
  { label: 'Ocean pH Level', value: '8.1', trend: 'down', change: '-0.02', icon: <Droplets className="w-7 h-7" />, color: 'blue', description: 'Slight acidification trend' },
  { label: 'Avg Sea Surface Temp', value: '17.6°C', trend: 'up', change: '+0.3°C', icon: <Thermometer className="w-7 h-7" />, color: 'orange', description: 'Rising from 2023 baseline' },
  { label: 'Ocean Oxygen Level', value: '6.2 mg/L', trend: 'down', change: '-0.1', icon: <Wind className="w-7 h-7" />, color: 'emerald', description: 'Below optimal threshold' },
  { label: 'Sea Level Rise', value: '+3.6mm/yr', trend: 'up', change: '+0.4', icon: <Waves className="w-7 h-7" />, color: 'cyan', description: 'Accelerating trend detected' },
];

const oceanFacts = [
  { number: '362M', label: 'Square km of ocean', sub: '71% of Earth\'s surface' },
  { number: '11,034m', label: 'Deepest point', sub: 'Mariana Trench' },
  { number: '230K+', label: 'Known species', sub: 'Estimated 2M+ total' },
  { number: '50-80%', label: 'Oxygen from oceans', sub: 'Via phytoplankton' },
];

function OceanStats() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] selection:bg-biolum-teal/30 selection:text-biolum-teal">
      <PublicNavigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-6xl font-black tracking-tighter text-white mb-4">
            Ocean <span className="text-biolum-teal">Intelligence</span>
          </h1>
          <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold max-w-2xl mx-auto">
            Real-time ocean health metrics, biodiversity trends, and environmental monitoring data
          </p>
        </motion.div>

        {/* Ocean Facts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {oceanFacts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[2rem] p-6 text-center hover:bg-black/40 transition-colors duration-500"
            >
              <div className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2">{fact.number}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-biolum-teal mb-1">{fact.label}</div>
              <div className="text-xs text-gray-500 font-medium">{fact.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Health Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {oceanHealthMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[2rem] p-8 hover:-translate-y-1 hover:shadow-2xl hover:bg-black/40 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-biolum-teal">{metric.icon}</div>
                <div className={`flex items-center gap-1 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg ${
                  metric.trend === 'up' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-biolum-emerald/10 text-biolum-emerald border border-biolum-emerald/20'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {metric.change}
                </div>
              </div>
              <div className="text-4xl font-black tracking-tighter text-white mb-2">{metric.value}</div>
              <div className="text-xs font-bold tracking-widest uppercase text-gray-400">{metric.label}</div>
              <div className="text-sm text-gray-500 mt-3 font-medium">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Temperature Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <Thermometer className="w-8 h-8 text-biolum-teal" />
              <h3 className="text-2xl font-black tracking-tighter text-white">Sea Surface Temperature Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis domain={[15.5, 18]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="temp" stroke="#06b6d4" strokeWidth={3} fill="url(#tempGrad)" dot={{ r: 4, fill: '#06b6d4' }} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2 text-center">Global average sea surface temperature (°C) — 2015 to 2024</p>
          </motion.div>

          {/* Biodiversity Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <Fish className="w-8 h-8 text-biolum-teal" />
              <h3 className="text-2xl font-black tracking-tighter text-white">Marine Biodiversity Distribution</h3>
            </div>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={280}>
                <PieChart>
                  <Pie data={biodiversityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {biodiversityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-[40%] space-y-3">
                {biodiversityData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{item.name}</span>
                    <span className="text-sm font-black text-white ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-biolum-teal/5 rounded-full blur-[100px] pointer-events-none" />
          <BarChart3 className="w-16 h-16 text-biolum-teal mx-auto mb-6 relative z-10" />
          <h2 className="text-4xl font-black tracking-tighter text-white mb-4 relative z-10">Access Advanced Analytics</h2>
          <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold max-w-xl mx-auto relative z-10">
            Researchers get access to ML-powered stock prediction, eDNA analysis, advanced taxonomy browsing, and more.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-3 bg-biolum-teal hover:bg-cyan-400 text-obsidian-900 px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105 relative z-10"
          >
            Researcher Portal <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default OceanStats;
