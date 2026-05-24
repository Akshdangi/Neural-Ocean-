import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import { Dna, Beaker, Search, BarChart3 } from 'lucide-react';

function EDNA() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data'
  });

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
            <h1 className="text-4xl font-bold text-white mb-2">eDNA Analysis</h1>
            <p className="text-gray-400 mb-8">Environmental DNA sequencing and biodiversity monitoring</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <Dna className="w-8 h-8" />, title: 'DNA Sequences', count: '32,150 Samples' },
                { icon: <Beaker className="w-8 h-8" />, title: 'Sample Processing', count: '127 Locations' },
                { icon: <Search className="w-8 h-8" />, title: 'Species Detection', count: '1,847 Species' },
                { icon: <BarChart3 className="w-8 h-8" />, title: 'Diversity Index', count: '87.3 Average' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                >
                  <div className="text-emerald-400 mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.count}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 text-center">
              <Dna className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Environmental DNA Platform</h2>
              <p className="text-gray-300 mb-6">
                Advanced eDNA sequencing and analysis platform for biodiversity monitoring, 
                species detection, and ecosystem health assessment through environmental samples.
              </p>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                Process eDNA Samples
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default EDNA;