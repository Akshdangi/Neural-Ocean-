import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import DashboardStats from '../components/dashboard/DashboardStats';
import PlanktonParticles from '../components/ui/PlanktonParticles';
import Cesium3DOcean from '../components/maps/Cesium3DOcean';
import DashboardCharts from '../components/dashboard/DashboardCharts';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

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
    <div className="min-h-screen relative bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] selection:bg-biolum-teal/30 selection:text-biolum-teal">
      <PlanktonParticles />
      <div className="relative z-10">
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
            <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
              Deep Intelligence
            </h1>
            <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold">
              Real-time insights from global marine telemetry
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
    </div>
  );
}

export default Dashboard;