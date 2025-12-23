import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import { Book, Code, Key, Globe } from 'lucide-react';

function APIDocs() {
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
            <h1 className="text-4xl font-bold text-white mb-2">API Documentation</h1>
            <p className="text-gray-400 mb-8">RESTful API for accessing Neural Ocean data and services</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <Book className="w-8 h-8" />, title: 'API Endpoints', count: '47 Available' },
                { icon: <Code className="w-8 h-8" />, title: 'Code Examples', count: '12 Languages' },
                { icon: <Key className="w-8 h-8" />, title: 'Authentication', count: 'OAuth 2.0' },
                { icon: <Globe className="w-8 h-8" />, title: 'Rate Limiting', count: '1000/hour' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                >
                  <div className="text-orange-400 mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.count}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 text-center">
              <Book className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Neural Ocean API</h2>
              <p className="text-gray-300 mb-6">
                Comprehensive RESTful API documentation for developers to integrate Neural Ocean's 
                marine data, AI models, and analysis tools into their applications.
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                View Documentation
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default APIDocs;