/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/layout/Navigation";
import Sidebar from "../components/layout/Sidebar";
import { Microscope, Ruler, Camera, Brain, Loader2, Upload, CheckCircle, BarChart3 } from "lucide-react";
import { predictOtolith, getOtolithStatus, trainOtolithModel, type OtolithPrediction, type ModelStatus } from "../services/mlApi";

function OtolithMorphology() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    timeRange: "Last 30 days",
    location: "Global",
    dataType: "All Data",
  });

  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [measurements, setMeasurements] = useState({
    length: '',
    width: '',
    weight: '',
  });
  const [prediction, setPrediction] = useState<OtolithPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Batch analysis state
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    getOtolithStatus().then(setModelStatus).catch(() => {});
  }, []);

  const handleTrain = async () => {
    setIsTraining(true);
    setError(null);
    try {
      await trainOtolithModel();
      const status = await getOtolithStatus();
      setModelStatus(status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredict = async () => {
    const length = parseFloat(measurements.length);
    const width = parseFloat(measurements.width);
    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
      setError('Please enter valid length and width values.');
      return;
    }
    setLoading(true);
    setPrediction(null);
    setError(null);
    try {
      const result = await predictOtolith({
        length,
        width,
        weight: measurements.weight ? parseFloat(measurements.weight) : undefined,
      });
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchAnalysis = async () => {
    if (modelStatus?.status !== 'ready') return;
    setBatchLoading(true);
    setError(null);
    const results: any[] = [];
    // Generate 20 random samples
    for (let i = 0; i < 20; i++) {
      const length = (Math.random() * 4 + 2).toFixed(2);
      const width = (Math.random() * 2 + 0.5).toFixed(2);
      const weight = (Math.random() * 0.1 + 0.01).toFixed(4);
      try {
        const pred = await predictOtolith({
          length: parseFloat(length),
          width: parseFloat(width),
          weight: parseFloat(weight),
        });
        results.push({ id: i + 1, length, width, weight, ...pred });
      } catch {
        results.push({ id: i + 1, length, width, weight, predicted_age: 'Error' });
      }
    }
    setBatchResults(results);
    setBatchLoading(false);
  };

  if (!user) return null;

  const handleLogout = () => { logout(); navigate("/"); };
  const handleExport = (format: string) => { console.log(`Export ${format}`); };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#1e293b_50%,#0f172a_100%)] selection:bg-amber-500/30 selection:text-amber-300">
      <Navigation onLogout={handleLogout} />

      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={setFilters} onExport={handleExport} />

        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Abyssal Tech Banner */}
            <div className="relative w-full h-[300px] rounded-[3rem] overflow-hidden mb-8 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.15)] group">
              <img src="/assets/otolith.png" alt="Otolith Morphology" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
              
              <div className="absolute bottom-8 left-8">
                <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-[10px] font-black tracking-widest uppercase text-amber-400 mb-3">
                  Microscopic Analysis
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                  Otolith Morphology
                </h1>
              </div>
            </div>

            <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold">
              Predict fish age and growth patterns from ear bone measurements
            </p>

            {/* Summary cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <Microscope className="w-8 h-8" />, title: "ML Model", count: modelStatus?.status === 'ready' ? '✓ Trained' : '○ Not Trained' },
                { icon: <Ruler className="w-8 h-8" />, title: "Features", count: "6 Morphometric" },
                { icon: <Camera className="w-8 h-8" />, title: "Algorithm", count: "Random Forest" },
                { icon: <Brain className="w-8 h-8" />, title: "R² Score", count: modelStatus?.metrics?.test_r2 ? `${(modelStatus.metrics.test_r2 * 100).toFixed(1)}%` : 'N/A' },
              ].map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[2rem] p-6 text-center shadow-2xl hover:-translate-y-1 hover:bg-black/40 transition-all duration-500 group">
                  <div className="text-biolum-teal mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                  <h3 className="text-white font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{item.count}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Single Prediction Panel */}
              <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Microscope className="w-8 h-8 text-biolum-teal" />
                  <h2 className="text-3xl font-black tracking-tighter text-white">Age Prediction</h2>
                </div>

                {modelStatus && modelStatus.status !== 'ready' && (
                  <button onClick={handleTrain} disabled={isTraining}
                    className="w-full mb-6 px-4 py-4 bg-black/40 hover:bg-white/[0.1] border border-white/[0.1] text-white font-black tracking-widest uppercase text-xs rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3 transition-all duration-300">
                    {isTraining ? <><Loader2 className="w-4 h-4 animate-spin" /> Training...</> : <><Brain className="w-4 h-4 text-biolum-teal" /> Train Model First</>}
                  </button>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Otolith Length (mm) *</label>
                    <input type="number" step="0.01" value={measurements.length}
                      onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. 4.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Otolith Width (mm) *</label>
                    <input type="number" step="0.01" value={measurements.width}
                      onChange={(e) => setMeasurements({ ...measurements, width: e.target.value })}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. 1.8" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Weight (g) — optional</label>
                    <input type="number" step="0.001" value={measurements.weight}
                      onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. 0.045" />
                  </div>

                  <button onClick={handlePredict} disabled={loading || modelStatus?.status !== 'ready'}
                    className="w-full px-4 py-4 bg-biolum-teal hover:bg-cyan-400 text-obsidian-900 font-black tracking-widest uppercase text-xs rounded-2xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] mt-6">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</> : <><Brain className="w-4 h-4" /> Predict Age</>}
                  </button>
                </div>

                {error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"><p className="text-red-400 text-sm">{error}</p></div>}
              </div>

              {/* Results Panel */}
              <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-biolum-purple/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <CheckCircle className="w-8 h-8 text-biolum-purple" />
                  <h2 className="text-3xl font-black tracking-tighter text-white">Prediction Results</h2>
                </div>

                {!prediction ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Ruler className="w-16 h-16 mb-4 opacity-30" />
                    <p>Enter measurements and click Predict</p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-black/20 border border-white/[0.05] rounded-3xl p-8 text-center relative z-10 shadow-inner">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Predicted Fish Age</h3>
                      <p className="text-7xl font-black tracking-tighter text-white">{prediction.predicted_age}</p>
                      <p className="text-lg text-biolum-purple font-bold mt-1">years</p>
                      {prediction.confidence_interval.length === 2 && (
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-4">
                          95% CI: [{prediction.confidence_interval[0]} — {prediction.confidence_interval[1]}] years
                        </p>
                      )}
                    </div>

                    {/* Feature Importance */}
                    {prediction.feature_importance && Object.keys(prediction.feature_importance).length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="w-4 h-4 text-purple-400" />
                          <h4 className="text-sm font-semibold text-gray-300">Feature Importance</h4>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(prediction.feature_importance)
                            .sort(([,a], [,b]) => b - a)
                            .map(([feature, importance]) => (
                              <div key={feature} className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 w-20 truncate">{feature}</span>
                                <div className="flex-1 bg-black/50 rounded-full h-2">
                                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                                    style={{ width: `${importance * 100}%` }} />
                                </div>
                                <span className="text-xs text-gray-400 w-12 text-right">{(importance * 100).toFixed(1)}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Batch Analysis */}
            <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <Upload className="w-8 h-8 text-biolum-teal" />
                  <h2 className="text-3xl font-black tracking-tighter text-white">Batch Analysis</h2>
                </div>
                <button onClick={handleBatchAnalysis} disabled={batchLoading || modelStatus?.status !== 'ready'}
                  className="px-8 py-4 bg-biolum-teal hover:bg-cyan-400 text-obsidian-900 font-black tracking-widest uppercase text-xs rounded-2xl disabled:opacity-50 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  {batchLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Brain className="w-4 h-4" /> Analyze 20 Samples</>}
                </button>
              </div>

              {batchResults.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-white border border-white/[0.05] rounded-3xl overflow-hidden">
                    <thead>
                      <tr className="bg-black/20 text-left border-b border-white/[0.05]">
                        <th className="p-6 text-xs font-bold tracking-widest uppercase text-gray-500">#</th>
                        <th className="p-6 text-xs font-bold tracking-widest uppercase text-gray-500">Length (mm)</th>
                        <th className="p-6 text-xs font-bold tracking-widest uppercase text-gray-500">Width (mm)</th>
                        <th className="p-6 text-xs font-bold tracking-widest uppercase text-gray-500">Weight (g)</th>
                        <th className="p-6 text-xs font-bold tracking-widest uppercase text-gray-500">Predicted Age (yrs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchResults.map((r) => (
                        <tr key={r.id} className="border-t border-white/[0.05] hover:bg-black/20 transition-colors">
                          <td className="p-6 font-medium">{r.id}</td>
                          <td className="p-6">{r.length}</td>
                          <td className="p-6">{r.width}</td>
                          <td className="p-6">{r.weight}</td>
                          <td className="p-6 font-black text-biolum-purple">{typeof r.predicted_age === 'number' ? r.predicted_age.toFixed(1) : r.predicted_age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default OtolithMorphology;
