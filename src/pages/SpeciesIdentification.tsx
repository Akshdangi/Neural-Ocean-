/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/layout/Navigation";
import Sidebar from "../components/layout/Sidebar";
import SpeciesHeroSlider from "../components/species/SpeciesHeroSlider";
import { Upload, Search, FileText, Loader2, CheckCircle, Brain } from "lucide-react";
import { predictSpecies, getSpeciesStatus, trainSpeciesModel, type SpeciesPrediction, type ModelStatus } from "../services/mlApi";

function SpeciesUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpeciesPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    getSpeciesStatus().then(setModelStatus).catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setError(null);
    }
  };

  const handleTrain = async () => {
    setIsTraining(true);
    try {
      await trainSpeciesModel(5);
      const status = await getSpeciesStatus();
      setModelStatus(status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTraining(false);
    }
  };

  const identifySpecies = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const prediction = await predictSpecies(file);
      setResult(prediction);
    } catch (err: any) {
      setError(err.message || "Failed to identify species");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-10 bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Upload className="w-8 h-8 text-biolum-teal" />
          <h2 className="text-3xl font-black tracking-tighter text-white">Upload Species Image</h2>
        </div>
        {modelStatus && (
          <span className={`text-xs px-3 py-1 rounded-full font-bold ${
            modelStatus.status === 'ready' ? 'bg-green-500/20 text-green-400' :
            modelStatus.status === 'training' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {modelStatus.status === 'ready' ? '✓ Model Ready' : modelStatus.status === 'training' ? '⏳ Training...' : '○ Not Trained'}
          </span>
        )}
      </div>

      {/* Train button if not ready */}
      {modelStatus && modelStatus.status !== 'ready' && (
        <button
          onClick={handleTrain}
          disabled={isTraining}
          className="w-full mb-6 px-4 py-4 bg-black/40 hover:bg-white/[0.1] border border-white/[0.1] text-white font-black tracking-widest uppercase text-xs rounded-2xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3"
        >
          {isTraining ? <><Loader2 className="w-4 h-4 animate-spin" /> Training Model...</> : <><Brain className="w-4 h-4 text-biolum-teal" /> Train Species Model First</>}
        </button>
      )}

      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-6 py-4 bg-black/20 border border-white/[0.1] rounded-2xl text-white focus:outline-none focus:border-biolum-teal/50 focus:bg-black/40 transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-biolum-teal/10 file:text-biolum-teal hover:file:bg-biolum-teal/20 cursor-pointer"
        />

        {preview && (
          <div className="rounded-xl overflow-hidden border border-white/20">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          </div>
        )}

        <button
          onClick={identifySpecies}
          disabled={!file || loading || modelStatus?.status !== 'ready'}
          className="w-full px-8 py-4 bg-biolum-teal hover:bg-cyan-400 text-obsidian-900 font-black tracking-widest uppercase text-xs rounded-2xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] mt-6"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Identifying...</> : <><Search className="w-4 h-4" /> Identify Species</>}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 bg-black/50 border border-white/20 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Identification Result</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Species:</span>
              <span className="text-white font-bold text-lg">{result.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Confidence:</span>
              <span className="text-cyan-400 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
            </div>

            {/* Confidence bar */}
            <div className="w-full bg-black/60 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>

            {/* Top predictions */}
            {result.top_predictions && result.top_predictions.length > 1 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Predictions:</h4>
                <div className="space-y-2">
                  {result.top_predictions.map((pred, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-4">{i + 1}.</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{pred.name}</span>
                          <span className="text-gray-400">{(pred.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-cyan-500/60 h-1.5 rounded-full"
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SpeciesIdentification() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };
  const handleExport = (format: string) => { console.log(`Export ${format}`); };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0d9488_0%,#064e3b_50%,#022c22_100%)] selection:bg-teal-500/30 selection:text-teal-300">
      <Navigation onLogout={handleLogout} />

      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={setFilters} onExport={handleExport} />

        <main className="flex-1 p-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <SpeciesHeroSlider />
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
              Species Neural ID
            </h1>
            <p className="text-gray-300 mb-8 font-bold tracking-wide">
              Coral Reef & Bioluminescence Analysis Engine
            </p>
            <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold">
              Identify marine species using AI-powered image recognition (MobileNetV2)
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <SpeciesUpload />
              </div>

              <div className="space-y-4">
                <motion.div
                  className="p-10 bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] shadow-2xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-6 h-6 text-biolum-teal" />
                    <h3 className="text-2xl font-black tracking-tighter text-white">How It Works</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-300">
                    <p>• Upload a clear image of a marine species</p>
                    <p>• Our <strong className="text-cyan-400">MobileNetV2</strong> model classifies the species</p>
                    <p>• Transfer learning on 10 marine species categories</p>
                    <p>• Get top-5 predictions with confidence scores</p>
                    <p>• Supported formats: JPG, PNG, WebP</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default SpeciesIdentification;
