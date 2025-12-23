import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import DatasetUpload from '../components/datasets/DatasetUpload';
import DatasetTable from '../components/datasets/DatasetTable';
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

  if (!user) {
    navigate('/login');
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
            <h1 className="text-4xl font-bold text-white mb-2">
              Dataset Management
            </h1>
            <p className="text-gray-400 mb-8">
              Upload, manage, and analyze marine research datasets
            </p>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'browse'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                Browse Datasets
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'upload'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search datasets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-gray-300 hover:text-white transition-all duration-200">
                    <Filter className="w-4 h-4" />
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
  );
}

export default Datasets;