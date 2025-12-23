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
    <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-2xl font-bold text-white">
              Neural <span className="text-cyan-400">Ocean</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative"
              >
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}>
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200">
                <User className="w-5 h-5 text-gray-300" />
                <div className="text-sm">
                  <div className="text-white font-medium">{user?.name}</div>
                  <div className="text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-gray-400 text-sm">{user?.email}</div>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded transition-colors">
                    Account Preferences
                  </button>
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;