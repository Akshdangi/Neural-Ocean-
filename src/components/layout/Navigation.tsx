import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Database, BarChart3, FileText, Microscope, 
  Dna, Book, LogOut, User, Bell, Settings, Search, Brain
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SettingsModal from '../SettingsModal';

interface NavigationProps {
  onLogout: () => void;
}

function Navigation({ onLogout }: NavigationProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/datasets', label: 'Datasets', icon: <Database className="w-5 h-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/taxonomy', label: 'Taxonomy', icon: <FileText className="w-5 h-5" /> },
    { path: '/otolith', label: 'Otolith Morphology', icon: <Microscope className="w-5 h-5" /> },
    { path: '/edna', label: 'eDNA', icon: <Dna className="w-5 h-5" /> },
    { path: '/api-docs', label: 'API Docs', icon: <Book className="w-5 h-5" /> },
    { path: '/species-id', label: 'Species ID', icon: <Search className="w-5 h-5" /> },
    { path: '/ml-dashboard', label: 'ML Models', icon: <Brain className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)]/80 backdrop-blur-3xl border-b border-white/[0.05] sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-3xl font-black tracking-tighter text-white transition-all hover:scale-[1.02]">
              Neural <span className="bg-gradient-to-br from-biolum-teal to-biolum-emerald bg-clip-text text-transparent">Ocean</span>
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
                <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold tracking-wide text-sm ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-gray-400 hover:text-biolum-teal'
                }`}>
                  <span className={`transition-all duration-300 ${
                    location.pathname === item.path ? 'scale-110 text-biolum-teal' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-black/30 rounded-xl border border-white/[0.1] -z-10 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
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
              className="text-gray-400 hover:text-biolum-teal transition-colors p-2.5 rounded-xl hover:bg-black/30"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-400 hover:text-biolum-teal transition-colors p-2.5 rounded-xl hover:bg-black/30"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 bg-black/20 hover:bg-black/40 border border-white/[0.05] hover:border-white/[0.1] rounded-2xl px-4 py-2 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              >
                <div className="w-8 h-8 rounded-full bg-biolum-teal flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <User className="w-4 h-4 text-obsidian-900" />
                </div>
                <div className="text-sm hidden sm:block">
                  <div className="text-white font-bold tracking-wide">{user?.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-biolum-teal/20 text-biolum-teal font-black border border-biolum-teal/30">Researcher</span>
                  </div>
                </div>
              </motion.button>
              
              {/* Dropdown Menu */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-3 w-64 bg-obsidian-800/90 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] rounded-[2rem] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="px-4 py-4 bg-black/20 border border-white/[0.05] mb-2 rounded-2xl">
                    <div className="text-white font-bold tracking-wide">{user?.name}</div>
                    <div className="text-gray-400 text-xs tracking-wider">{user?.email}</div>
                  </div>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full text-left px-4 py-3 text-gray-400 hover:bg-black/30 hover:text-white rounded-xl transition-all duration-200 flex items-center space-x-3 text-sm font-bold tracking-wide"
                  >
                    <User className="w-4 h-4 text-biolum-teal" />
                    <span>Profile Settings</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full text-left px-4 py-3 text-gray-400 hover:bg-black/30 hover:text-white rounded-xl transition-all duration-200 flex items-center space-x-3 text-sm font-bold tracking-wide"
                  >
                    <Settings className="w-4 h-4 text-biolum-teal" />
                    <span>Account Preferences</span>
                  </motion.button>
                  <div className="border-t border-white/[0.05] mt-2 pt-2">
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={onLogout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 flex items-center space-x-3 text-sm font-bold tracking-wide"
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

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
}

export default Navigation;