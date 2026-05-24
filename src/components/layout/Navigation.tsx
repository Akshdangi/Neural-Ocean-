import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Database, BarChart3, FileText, Microscope, 
  Dna, Book, LogOut, User, Bell, Settings, Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  onLogout: () => void;
}

function Navigation({ onLogout }: NavigationProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/datasets', label: 'Datasets', icon: <Database className="w-5 h-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/taxonomy', label: 'Taxonomy', icon: <FileText className="w-5 h-5" /> },
    { path: '/otolith', label: 'Otolith Morphology', icon: <Microscope className="w-5 h-5" /> },
    { path: '/edna', label: 'eDNA', icon: <Dna className="w-5 h-5" /> },
    { path: '/api-docs', label: 'API Docs', icon: <Book className="w-5 h-5" /> },
    { path: '/species-id', label: 'Species ID', icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-3xl font-black text-white transition-all hover:scale-105">
              Neural <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Ocean</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative group"
              >
                <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-gray-300 group-hover:text-white'
                }`}>
                  <span className={`transition-all duration-300 ${
                    location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/40 -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className="text-gray-300 hover:text-cyan-400 transition-colors p-2.5 rounded-lg hover:bg-white/10"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className="text-gray-300 hover:text-cyan-400 transition-colors p-2.5 rounded-lg hover:bg-white/10"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 hover:border-white/40 rounded-xl px-4 py-2.5 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm hidden sm:block">
                  <div className="text-white font-bold">{user?.name}</div>
                  <div className="text-gray-400 text-xs capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </motion.button>
              
              {/* Dropdown Menu */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-3 w-56 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="px-4 py-3 bg-white/5 border-b border-white/10 mb-2 rounded-lg">
                    <div className="text-white font-bold">{user?.name}</div>
                    <div className="text-gray-400 text-sm">{user?.email}</div>
                  </div>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-cyan-300 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-cyan-300 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Account Preferences</span>
                  </motion.button>
                  <div className="border-t border-white/10 mt-3 pt-3">
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;