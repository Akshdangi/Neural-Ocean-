import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import DashboardStats from '../components/dashboard/DashboardStats';
import OceanMap from '../components/maps/OceanMap';
function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();
  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Welcome notification
    addNotification({
      type: 'success',
      title: 'Welcome back!',
      message: `Dashboard loaded successfully for ${user.name}`
    });
  }, [user, navigate, addNotification]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar 
          filters={filters} 
          onFiltersChange={setFilters}
          onExport={handleExport}
        />
        
        <main className="flex-1 p-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mb-8">
              Real-time insights from marine data across the globe
            </p>

            <DashboardStats filters={filters} />
            
            <div className="space-y-8 mb-8">
              {/* 3D Ocean Visualization - Full Width */}
              <OceanMap />
              
              {/* Charts Grid */}
              <div className="grid lg:grid-cols-1 gap-8">
              <DashboardCharts filters={filters} />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;