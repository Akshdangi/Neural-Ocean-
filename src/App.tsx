import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
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

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/datasets" element={<Datasets />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/taxonomy" element={<Taxonomy />} />
                <Route path="/otolith" element={<OtolithMorphology />} />
                <Route path="/edna" element={<EDNA />} />
                <Route path="/api-docs" element={<APIDocs />} />
                <Route path="/species-id" element={<SpeciesIdentification />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;