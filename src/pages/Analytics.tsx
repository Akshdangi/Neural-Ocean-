/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart as RePieChart,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

function Analytics() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data'
  });
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExport = (format: string) => {
    console.log(`Export ${format}`);
  };

  // Mock dataset data (used only for charts)
  const datasets = [
    { id: 1, name: 'Atlantic Tuna Stock Assessment 2024', type: 'Fisheries', location: 'Atlantic Ocean', date: '2024-01-15', size: '2.4 MB', records: 15420, format: 'CSV', status: 'Processed' },
    { id: 2, name: 'Mediterranean Biodiversity Survey', type: 'Biodiversity', location: 'Mediterranean Sea', date: '2024-01-10', size: '1.8 MB', records: 8930, format: 'JSON', status: 'Processing' },
    { id: 3, name: 'Pacific eDNA Sampling - Q4 2023', type: 'eDNA', location: 'Pacific Ocean', date: '2023-12-28', size: '5.2 MB', records: 32150, format: 'FASTA', status: 'Processed' },
    { id: 4, name: 'Arctic Ocean Temperature Profiles', type: 'Oceanographic', location: 'Arctic Ocean', date: '2023-12-20', size: '3.1 MB', records: 18745, format: 'CSV', status: 'Processed' },
    { id: 5, name: 'Coral Reef Health Assessment', type: 'Biodiversity', location: 'Indian Ocean', date: '2023-12-15', size: '4.7 MB', records: 25680, format: 'JSON', status: 'Processed' },
    { id: 6, name: 'North Sea Cod Population 2023', type: 'Fisheries', location: 'North Sea', date: '2023-11-22', size: '2.9 MB', records: 14300, format: 'CSV', status: 'Processed' },
    { id: 7, name: 'Caribbean Coral Bleaching Events', type: 'Biodiversity', location: 'Caribbean Sea', date: '2023-11-05', size: '3.3 MB', records: 11900, format: 'JSON', status: 'Processing' },
    { id: 8, name: 'Bay of Bengal Phytoplankton Census', type: 'eDNA', location: 'Bay of Bengal', date: '2023-10-18', size: '6.4 MB', records: 40500, format: 'FASTA', status: 'Processed' },
    { id: 9, name: 'Southern Ocean Salinity Trends', type: 'Oceanographic', location: 'Southern Ocean', date: '2023-09-27', size: '2.6 MB', records: 13250, format: 'CSV', status: 'Processed' },
    { id: 10, name: 'Gulf of Mexico Shrimp Fisheries Report', type: 'Fisheries', location: 'Gulf of Mexico', date: '2023-09-10', size: '2.2 MB', records: 9800, format: 'CSV', status: 'Processed' },
    { id: 11, name: 'Baltic Sea Biodiversity Index 2023', type: 'Biodiversity', location: 'Baltic Sea', date: '2023-08-30', size: '4.0 MB', records: 17600, format: 'JSON', status: 'Processed' },
    { id: 12, name: 'Hawaiian Coral Reef eDNA Study', type: 'eDNA', location: 'Pacific Ocean', date: '2023-08-15', size: '7.5 MB', records: 50230, format: 'FASTA', status: 'Processing' },
    { id: 13, name: 'Norwegian Sea Temperature Series', type: 'Oceanographic', location: 'Norwegian Sea', date: '2023-07-20', size: '3.7 MB', records: 14850, format: 'CSV', status: 'Processed' },
    { id: 14, name: 'South China Sea Fish Stock Data', type: 'Fisheries', location: 'South China Sea', date: '2023-07-01', size: '2.5 MB', records: 12500, format: 'CSV', status: 'Processed' },
    { id: 15, name: 'Great Barrier Reef Species Catalog', type: 'Biodiversity', location: 'Coral Sea', date: '2023-06-14', size: '5.8 MB', records: 38900, format: 'JSON', status: 'Processed' },
    { id: 16, name: 'California Current eDNA Archive', type: 'eDNA', location: 'Pacific Ocean', date: '2023-05-25', size: '8.2 MB', records: 61200, format: 'FASTA', status: 'Processed' },
    { id: 17, name: 'Antarctic Ice Shelf Temperature Records', type: 'Oceanographic', location: 'Southern Ocean', date: '2023-05-10', size: '4.1 MB', records: 22000, format: 'CSV', status: 'Processed' },
    { id: 18, name: 'Black Sea Anchovy Fisheries Report', type: 'Fisheries', location: 'Black Sea', date: '2023-04-28', size: '1.9 MB', records: 8200, format: 'CSV', status: 'Processing' },
    { id: 19, name: 'Red Sea Coral Biodiversity 2023', type: 'Biodiversity', location: 'Red Sea', date: '2023-04-12', size: '4.9 MB', records: 27850, format: 'JSON', status: 'Processed' },
    { id: 20, name: 'Japan Coastal eDNA Pilot Study', type: 'eDNA', location: 'Pacific Ocean', date: '2023-03-30', size: '6.7 MB', records: 43120, format: 'FASTA', status: 'Processed' }
  ];

  // === Chart Data Processing ===
  const typeDistribution = Object.entries(
    datasets.reduce((acc: any, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const recordsOverTime = datasets.map(d => ({
    date: d.date,
    records: d.records
  }));

  const statusDistribution = Object.entries(
    datasets.reduce((acc: any, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#06b6d4', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen">
      <Navigation onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar 
          filters={filters} 
          onFiltersChange={setFilters}
          onExport={handleExport}
        />
        
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-gray-400 mb-8">Deep insights and predictive models for marine data</p>

            {/* Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <BarChart3 className="w-8 h-8" />, title: 'Statistical Analysis', count: '12 Active Models' },
                { icon: <TrendingUp className="w-8 h-8" />, title: 'Trend Forecasting', count: '85% Accuracy' },
                { icon: <PieChart className="w-8 h-8" />, title: 'Distribution Maps', count: '247 Regions' },
                { icon: <Activity className="w-8 h-8" />, title: 'Real-time Monitoring', count: '24/7 Active' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                >
                  <div className="text-cyan-400 mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.count}</p>
                </motion.div>
              ))}
            </div>

            {/* Launch Button */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 text-center mb-8">
              <BarChart3 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Advanced Analytics Dashboard</h2>
              <p className="text-gray-300 mb-6">
                Comprehensive analytics tools for marine data analysis, including predictive modeling, 
                statistical analysis, and trend forecasting capabilities.
              </p>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {showAnalytics ? 'Hide Analytics Suite' : 'Launch Analytics Suite'}
              </button>
            </div>

            {/* Charts Section (toggles with button) */}
            {showAnalytics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Dataset Type Distribution */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Dataset Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RePieChart>
                        <Pie
                          data={typeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {typeDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Records Over Time */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Records Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={recordsOverTime}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="records" stroke="#06b6d4" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Dataset Status */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Dataset Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusDistribution}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;
