import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import DatasetUpload from '../components/datasets/DatasetUpload';
import DatasetTable from '../components/datasets/DatasetTable';
import CyberGrid from '../components/ui/CyberGrid';
import { Upload, Search, Filter } from 'lucide-react';

function Datasets() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExport = (format: string) => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: `Generating ${format} export with current filters...`
    });
  };

  return (
    <div className="min-h-screen relative bg-[linear-gradient(180deg,#0f172a_0%,#1e3a8a_50%,#020617_100%)] selection:bg-cyan-500/30 selection:text-cyan-300">
      <CyberGrid />
      <div className="relative z-10">
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
            <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
              Data Core
            </h1>
            <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold">
              Upload, sequence, and analyze marine intelligence
            </p>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-8 py-3.5 rounded-2xl font-black tracking-widest uppercase text-xs transition-all duration-300 ${
                  activeTab === 'browse'
                    ? 'bg-biolum-teal text-obsidian-900 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-black/30 text-gray-500 hover:bg-white/[0.06] hover:text-white border border-white/[0.05]'
                }`}
              >
                Browse Datasets
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-8 py-3.5 rounded-2xl font-black tracking-widest uppercase text-xs transition-all duration-300 flex items-center space-x-3 ${
                  activeTab === 'upload'
                    ? 'bg-biolum-teal text-obsidian-900 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-black/30 text-gray-500 hover:bg-white/[0.06] hover:text-white border border-white/[0.05]'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Dataset</span>
              </button>
            </div>

            {activeTab === 'browse' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search datasets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black/20 border border-white/[0.1] rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-biolum-teal/50 focus:bg-black/40 transition-all duration-300 font-medium"
                    />
                  </div>
                  <button className="flex items-center space-x-3 bg-black/30 hover:bg-white/[0.06] border border-white/[0.1] rounded-2xl px-6 py-4 text-gray-400 hover:text-white font-bold tracking-widest uppercase text-xs transition-all duration-300">
                    <Filter className="w-4 h-4 text-biolum-teal" />
                    <span>Advanced Filters</span>
                  </button>
                </div>

                <DatasetTable searchTerm={searchTerm} filters={filters} />
              </div>
            )}

            {activeTab === 'upload' && (
              <DatasetUpload />
            )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Datasets;