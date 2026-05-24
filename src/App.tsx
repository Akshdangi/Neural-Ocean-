import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Datasets from './pages/Datasets';
import Analytics from './pages/Analytics';
import Taxonomy from './pages/Taxonomy';
import OtolithMorphology from './pages/OtolithMorphology';
import EDNA from './pages/EDNA';
import APIDocs from './pages/APIDocs';
import SpeciesIdentification from './pages/SpeciesIdentification';
import MLDashboard from './pages/MLDashboard';
import PublicDashboard from './pages/PublicDashboard';
import SpeciesExplorer from './pages/SpeciesExplorer';
import OceanStats from './pages/OceanStats';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] selection:bg-biolum-teal/30 selection:text-biolum-teal">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes — no login required */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/explore" element={<PublicDashboard />} />
          <Route path="/species" element={<SpeciesExplorer />} />
          <Route path="/ocean-stats" element={<OceanStats />} />

          {/* Researcher-only routes — requires login + researcher role */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/datasets" element={<ProtectedRoute><Datasets /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/taxonomy" element={<ProtectedRoute><Taxonomy /></ProtectedRoute>} />
          <Route path="/otolith" element={<ProtectedRoute><OtolithMorphology /></ProtectedRoute>} />
          <Route path="/edna" element={<ProtectedRoute><EDNA /></ProtectedRoute>} />
          <Route path="/api-docs" element={<ProtectedRoute><APIDocs /></ProtectedRoute>} />
          <Route path="/species-id" element={<ProtectedRoute><SpeciesIdentification /></ProtectedRoute>} />
          <Route path="/ml-dashboard" element={<ProtectedRoute><MLDashboard /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;