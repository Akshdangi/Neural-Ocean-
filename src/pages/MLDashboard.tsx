/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import {
  Brain, Fish, Microscope, Dna, Activity,
  CheckCircle, XCircle, Loader2, Clock, Zap,
  BarChart3, TrendingUp, ChevronRight
} from 'lucide-react';
import {
  getAllStatuses, trainModel,
  type ModelType, type ModelStatus, type TrainResponse
} from '../services/mlApi';

interface ModelCard {
  key: ModelType;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  algorithm: string;
}

const MODEL_CARDS: ModelCard[] = [
  {
    key: 'species',
    name: 'Species Identification',
    description: 'Classify marine species from uploaded images using deep learning',
    icon: <Fish className="w-8 h-8" />,
    gradient: 'from-cyan-500 to-blue-600',
    algorithm: 'MobileNetV2 (Transfer Learning)',
  },
  {
    key: 'stock',
    name: 'Fish Stock Prediction',
    description: 'Forecast fisheries stock levels using time-series analysis',
    icon: <TrendingUp className="w-8 h-8" />,
    gradient: 'from-emerald-500 to-teal-600',
    algorithm: 'LSTM Neural Network',
  },
  {
    key: 'otolith',
    name: 'Otolith Age Prediction',
    description: 'Predict fish age from otolith morphometric measurements',
    icon: <Microscope className="w-8 h-8" />,
    gradient: 'from-purple-500 to-indigo-600',
    algorithm: 'Random Forest Regressor',
  },
  {
    key: 'edna',
    name: 'eDNA Classification',
    description: 'Classify species from environmental DNA sequences',
    icon: <Dna className="w-8 h-8" />,
    gradient: 'from-orange-500 to-red-600',
    algorithm: 'Gradient Boosting (k-mer features)',
  },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    ready: { color: 'bg-green-500/20 text-green-400 border-green-500/40', icon: <CheckCircle className="w-4 h-4" />, label: 'Ready' },
    training: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', icon: <Loader2 className="w-4 h-4 animate-spin" />, label: 'Training...' },
    untrained: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/40', icon: <Clock className="w-4 h-4" />, label: 'Untrained' },
    error: { color: 'bg-red-500/20 text-red-400 border-red-500/40', icon: <XCircle className="w-4 h-4" />, label: 'Error' },
  };
  const c = config[status] || config.untrained;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${c.color}`}>
      {c.icon} {c.label}
    </span>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-black/50 border border-white/10 rounded-xl p-4 text-center">
      <div className="text-gray-400 mb-2 flex justify-center">{icon}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function MLDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data',
  });

  const [statuses, setStatuses] = useState<Record<ModelType, ModelStatus> | null>(null);
  const [training, setTraining] = useState<Record<string, boolean>>({});
  const [trainResults, setTrainResults] = useState<Record<string, TrainResponse | null>>({});
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch statuses on mount
  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStatuses() {
    try {
      const s = await getAllStatuses();
      setStatuses(s);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  }

  async function handleTrain(modelKey: ModelType) {
    setTraining((prev) => ({ ...prev, [modelKey]: true }));
    setTrainResults((prev) => ({ ...prev, [modelKey]: null }));
    try {
      const result = await trainModel(modelKey);
      setTrainResults((prev) => ({ ...prev, [modelKey]: result }));
      await fetchStatuses();
    } catch (err: any) {
      setTrainResults((prev) => ({
        ...prev,
        [modelKey]: { status: 'error', message: err.message, metrics: {}, training_time_seconds: 0 },
      }));
    } finally {
      setTraining((prev) => ({ ...prev, [modelKey]: false }));
    }
  }

  const handleLogout = () => { logout(); navigate('/'); };
  const handleExport = () => {};

  if (!user) return null;

  const readyCount = statuses ? Object.values(statuses).filter((s) => s.status === 'ready').length : 0;

  return (
    <div className="min-h-screen">
      <Navigation onLogout={handleLogout} />

      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={setFilters} onExport={handleExport} />

        <main className="flex-1 p-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-10 h-10 text-cyan-400" />
                  <h1 className="text-4xl font-bold text-white">ML Models Dashboard</h1>
                </div>
                <p className="text-gray-400">Train, monitor, and deploy machine learning models for marine intelligence</p>
              </div>

              {/* Backend status */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                backendOnline === null ? 'border-gray-500/30 bg-gray-500/10' :
                backendOnline ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full ${
                  backendOnline === null ? 'bg-gray-400' :
                  backendOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`} />
                <span className={`text-sm font-medium ${
                  backendOnline === null ? 'text-gray-400' :
                  backendOnline ? 'text-green-400' : 'text-red-400'
                }`}>
                  {backendOnline === null ? 'Checking...' : backendOnline ? 'Backend Online' : 'Backend Offline'}
                </span>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <MetricCard label="Total Models" value="4" icon={<Brain className="w-6 h-6 text-cyan-400" />} />
              <MetricCard label="Models Ready" value={readyCount} icon={<CheckCircle className="w-6 h-6 text-green-400" />} />
              <MetricCard label="Algorithms" value="4" icon={<Zap className="w-6 h-6 text-yellow-400" />} />
              <MetricCard label="Active Training" value={Object.values(training).filter(Boolean).length} icon={<Activity className="w-6 h-6 text-purple-400" />} />
            </div>

            {/* Train All Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => MODEL_CARDS.forEach((m) => handleTrain(m.key))}
                disabled={Object.values(training).some(Boolean)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-cyan-500/30"
              >
                <Zap className="w-5 h-5" />
                Train All Models
              </button>
            </div>

            {/* Model Cards */}
            <div className="grid lg:grid-cols-2 gap-6">
              {MODEL_CARDS.map((card, idx) => {
                const status = statuses?.[card.key];
                const isTraining = training[card.key];
                const result = trainResults[card.key];
                const isExpanded = expandedCard === card.key;

                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
                      {/* Card Header */}
                      <div className={`bg-gradient-to-r ${card.gradient} p-1`} />

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`bg-gradient-to-r ${card.gradient} p-3 rounded-xl text-white shadow-lg`}>
                              {card.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{card.name}</h3>
                              <p className="text-sm text-gray-400 mt-1">{card.algorithm}</p>
                            </div>
                          </div>
                          <StatusBadge status={isTraining ? 'training' : (status?.status || 'untrained')} />
                        </div>

                        <p className="text-gray-300 text-sm mb-6">{card.description}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-4">
                          <button
                            onClick={() => handleTrain(card.key)}
                            disabled={isTraining}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                              isTraining
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : `bg-gradient-to-r ${card.gradient} text-white hover:shadow-lg`
                            }`}
                          >
                            {isTraining ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Training...</>
                            ) : (
                              <><Zap className="w-4 h-4" /> Train Model</>
                            )}
                          </button>

                          <button
                            onClick={() => setExpandedCard(isExpanded ? null : card.key)}
                            className="px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-black/60 transition-all duration-300"
                          >
                            <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        </div>

                        {/* Training Result */}
                        {result && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`p-4 rounded-xl mb-4 border ${
                              result.status === 'success'
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            <p className={`text-sm font-medium ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                              {result.message}
                            </p>
                            {result.training_time_seconds > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                Completed in {result.training_time_seconds.toFixed(1)}s
                              </p>
                            )}
                          </motion.div>
                        )}

                        {/* Expanded Metrics */}
                        {isExpanded && status?.metrics && Object.keys(status.metrics).length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-t border-white/10 pt-4"
                          >
                            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-cyan-400" /> Model Metrics
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(status.metrics)
                                .filter(([key]) => !['history', 'per_class_metrics', 'feature_importance'].includes(key))
                                .slice(0, 8)
                                .map(([key, value]) => (
                                  <div key={key} className="bg-black/50 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 truncate">{key.replace(/_/g, ' ')}</div>
                                    <div className="text-sm font-bold text-white mt-1">
                                      {typeof value === 'number' ? (value < 1 ? value.toFixed(4) : value.toFixed(2)) : String(value)}
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {status.last_trained && (
                              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Last trained: {new Date(status.last_trained).toLocaleString()}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Backend Instructions */}
            {backendOnline === false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-red-400 mb-3">⚠️ Backend Not Running</h3>
                <p className="text-gray-300 mb-4">Start the ML backend server to train and use models:</p>
                <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-gray-300">
                  <p className="text-gray-500"># Navigate to backend directory</p>
                  <p>cd backend</p>
                  <p className="text-gray-500 mt-2"># Install dependencies</p>
                  <p>pip install -r requirements.txt</p>
                  <p className="text-gray-500 mt-2"># Start the server</p>
                  <p>python main.py</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default MLDashboard;
