 
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartsProps {
  filters: {
    timeRange: string;
    location: string;
    dataType: string;
  };
}

// eslint-disable-next-line no-empty-pattern
function DashboardCharts({ }: ChartsProps) {
  // Mock data for demonstration
  const timeSeriesData = [
    { month: 'Jan', fishStock: 120, biodiversity: 85, temperature: 18.5 },
    { month: 'Feb', fishStock: 115, biodiversity: 82, temperature: 19.2 },
    { month: 'Mar', fishStock: 125, biodiversity: 88, temperature: 20.1 },
    { month: 'Apr', fishStock: 130, biodiversity: 90, temperature: 21.8 },
    { month: 'May', fishStock: 128, biodiversity: 87, temperature: 23.2 },
    { month: 'Jun', fishStock: 135, biodiversity: 92, temperature: 24.8 }
  ];

  const speciesData = [
    { name: 'Tuna', value: 35, color: '#3B82F6' },
    { name: 'Salmon', value: 28, color: '#10B981' },
    { name: 'Sardine', value: 22, color: '#F59E0B' },
    { name: 'Cod', value: 15, color: '#EF4444' }
  ];

  const regionData = [
    { region: 'Atlantic', count: 450 },
    { region: 'Pacific', count: 380 },
    { region: 'Indian', count: 290 },
    { region: 'Arctic', count: 120 },
    { region: 'Mediterranean', count: 200 }
  ];

  return (
    <div className="space-y-8">
      {/* Fish Stock Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Fish Stock Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="fishStock" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Biodiversity Index */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Biodiversity & Temperature</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area 
                type="monotone" 
                dataKey="biodiversity" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                stackId="2"
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Species Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Species Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Regional Data Coverage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="region" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#gradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardCharts;