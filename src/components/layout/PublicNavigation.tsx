import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Fish, BarChart3, LogIn, Waves, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const publicNavItems = [
  { path: '/explore', label: 'Explore', icon: <Globe className="w-5 h-5" /> },
  { path: '/species', label: 'Species', icon: <Fish className="w-5 h-5" /> },
  { path: '/ocean-stats', label: 'Ocean Stats', icon: <BarChart3 className="w-5 h-5" /> },
];

function PublicNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Waves className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-xl font-black text-white">
              Neural <span className="text-cyan-400">Ocean</span>
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {publicNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-black/60'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Area */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-lg border border-white/10">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{user.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                    {user.role === 'public' ? 'Public' : 'Researcher'}
                  </span>
                </div>
                {user.role !== 'public' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    Research Portal
                  </motion.button>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavigation;
