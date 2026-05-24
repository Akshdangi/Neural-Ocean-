/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import DNAAnimation from '../components/ui/DNAAnimation';
import { Dna, Beaker, Search, BarChart3, Loader2, Brain, CheckCircle, Sparkles } from 'lucide-react';
import { predictEDNA, getEDNAStatus, trainEDNAModel, type EDNAPrediction, type ModelStatus } from '../services/mlApi';

function EDNA() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data'
  });

  const [sequence, setSequence] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EDNAPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    getEDNAStatus().then(setModelStatus).catch(() => {});
  }, []);

  const handleTrain = async () => {
    setIsTraining(true);
    try {
      await trainEDNAModel();
      const status = await getEDNAStatus();
      setModelStatus(status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTraining(false);
    }
  };

  const handleClassify = async () => {
    if (!sequence || sequence.length < 20) {
      setError('Sequence must be at least 20 base pairs.');
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const prediction = await predictEDNA(sequence);
      setResult(prediction);
    } catch (err: any) {
      setError(err.message || 'Classification failed');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleSequence = () => {
    // Sample eDNA sequence (synthetic)
    const bases = ['A', 'T', 'C', 'G'];
    let seq = '';
    for (let i = 0; i < 200; i++) {
      seq += bases[Math.floor(Math.random() * 4)];
    }
    setSequence(seq);
    setResult(null);
  };

  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };
  const handleExport = (format: string) => { console.log(`Export ${format}`); };

  return (
    <div className="min-h-screen relative bg-[linear-gradient(180deg,#4c1d95_0%,#0f766e_50%,#022c22_100%)] selection:bg-purple-500/30 selection:text-purple-300">
      <Navigation onLogout={handleLogout} />
      <div className="flex relative z-10">
        <Sidebar 
          filters={filters} 
          onFiltersChange={setFilters}
          onExport={handleExport}
        />
        
        <main className="flex-1 p-8 space-y-8 relative">
          <DNAAnimation />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Dna className="w-8 h-8 text-purple-400" />
              <h1 className="text-5xl font-black tracking-tighter text-white">eDNA Analysis</h1>
            </div>
            <p className="text-gray-300 mb-10 text-sm uppercase tracking-widest font-bold">
              Molecular sequencing and biodiversity indexing
            </p>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <Dna className="w-8 h-8" />, title: 'DNA Sequences', count: '32,150 Samples' },
                { icon: <Beaker className="w-8 h-8" />, title: 'Sample Processing', count: '127 Locations' },
                { icon: <Search className="w-8 h-8" />, title: 'Species Detection', count: '1,847 Species' },
                { icon: <BarChart3 className="w-8 h-8" />, title: 'Model Status', count: modelStatus?.status === 'ready' ? '✓ Ready' : '○ Not Trained' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[2rem] p-6 text-center shadow-2xl hover:-translate-y-1 hover:bg-black/40 transition-all duration-500 group"
                >
                  <div className="text-biolum-emerald mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                  <h3 className="text-white font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{item.count}</p>
                </motion.div>
              ))}
            </div>

            {/* eDNA Classification Panel */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <Dna className="w-8 h-8 text-biolum-emerald" />
                  <h2 className="text-3xl font-black tracking-tighter text-white">Sequence Classification</h2>
                </div>

                {/* Train button */}
                {modelStatus && modelStatus.status !== 'ready' && (
                  <button
                    onClick={handleTrain}
                    disabled={isTraining}
                    className="w-full mb-6 px-4 py-4 bg-black/40 hover:bg-white/[0.1] border border-white/[0.1] text-white font-black tracking-widest uppercase text-xs rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3 transition-all duration-300"
                  >
                    {isTraining ? <><Loader2 className="w-4 h-4 animate-spin" /> Training eDNA Model...</> : <><Brain className="w-4 h-4 text-biolum-emerald" /> Train eDNA Model First</>}
                  </button>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">DNA Sequence (ATCG)</label>
                    <textarea
                      value={sequence}
                      onChange={(e) => setSequence(e.target.value.toUpperCase().replace(/[^ATCG]/g, ''))}
                      placeholder="Paste your eDNA sequence here (min 20bp)..."
                      className="w-full h-40 bg-black/20 border border-white/[0.1] rounded-2xl p-6 text-biolum-emerald font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-biolum-emerald/50 focus:bg-black/40 transition-all resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{sequence.length} base pairs</span>
                      <button onClick={loadSampleSequence} className="text-[10px] font-bold tracking-widest uppercase text-biolum-emerald hover:text-emerald-300">
                        Load sample sequence
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleClassify}
                    disabled={loading || !sequence || modelStatus?.status !== 'ready'}
                    className="w-full px-4 py-4 bg-biolum-emerald hover:bg-emerald-400 text-obsidian-900 font-black tracking-widest uppercase text-xs rounded-2xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-6"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Classifying...</> : <><Sparkles className="w-4 h-4" /> Classify Sequence</>}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Results Panel */}
              <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-biolum-emerald/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <CheckCircle className="w-8 h-8 text-biolum-emerald" />
                  <h2 className="text-3xl font-black tracking-tighter text-white">Classification Results</h2>
                </div>

                {!result ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Dna className="w-16 h-16 mb-4 opacity-30" />
                    <p>Enter a DNA sequence and click Classify</p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Primary result */}
                    <div className="bg-black/20 border border-white/[0.05] rounded-3xl p-8 text-center relative z-10 shadow-inner">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Identified Species</h3>
                      <p className="text-5xl font-black tracking-tighter text-white italic">{result.species}</p>
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mt-4">
                        Confidence: <span className="text-biolum-emerald font-black">{(result.confidence * 100).toFixed(1)}%</span>
                      </p>
                      <div className="w-full bg-black/40 rounded-full h-2 mt-3">
                        <div className="bg-gradient-to-r from-biolum-emerald to-biolum-teal h-2 rounded-full" style={{ width: `${result.confidence * 100}%` }} />
                      </div>
                    </div>

                    {/* Biodiversity Index */}
                    <div className="bg-black/20 border border-white/[0.05] rounded-3xl p-6 relative z-10 shadow-inner text-center">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Biodiversity Index</h4>
                      <div className="text-4xl font-black text-biolum-teal">{(result.biodiversity_index * 100).toFixed(1)}%</div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mt-2">Shannon entropy normalized score</p>
                    </div>

                    {/* Top predictions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">All Predictions</h4>
                      <div className="space-y-2">
                        {result.top_predictions.map((pred, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-4">{i + 1}.</span>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300 italic">{pred.name}</span>
                                <span className="text-gray-400">{(pred.confidence * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-black/50 rounded-full h-1.5 mt-1">
                                <div className="bg-emerald-500/60 h-1.5 rounded-full" style={{ width: `${pred.confidence * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default EDNA;