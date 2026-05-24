import { useState, useEffect } from 'react';
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
    console.log(`Export ${format}`);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] selection:bg-biolum-teal/30 selection:text-biolum-teal">
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
            <h1 className="text-5xl font-black tracking-tighter text-white mb-2">API Documentation</h1>
            <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold">RESTful API for accessing Neural Ocean data and services</p>

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
                  className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[2rem] p-6 text-center shadow-2xl hover:-translate-y-1 hover:bg-black/40 transition-all duration-500 group"
                >
                  <div className="text-biolum-teal mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                  <h3 className="text-white font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{item.count}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-biolum-teal/10 rounded-full blur-[100px] pointer-events-none" />
              <Book className="w-16 h-16 text-biolum-teal mx-auto mb-6 relative z-10" />
              <h2 className="text-3xl font-black tracking-tighter text-white mb-4 relative z-10">Neural Ocean API</h2>
              <p className="text-gray-400 mb-10 max-w-2xl mx-auto font-medium tracking-wide relative z-10">
                Comprehensive RESTful API documentation for developers to integrate Neural Ocean's 
                marine data, AI models, and analysis tools into their applications.
              </p>
              <button className="bg-biolum-teal hover:bg-cyan-400 text-obsidian-900 px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] relative z-10">
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