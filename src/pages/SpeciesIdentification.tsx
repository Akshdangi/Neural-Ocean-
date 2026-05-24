/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/layout/Navigation";
import Sidebar from "../components/layout/Sidebar";
import { Upload, Search, FileText } from "lucide-react";

function SpeciesUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const HF_API_URL =
    "https://api-inference.huggingface.co/models/microsoft/resnet-50";
  const HF_API_KEY = "YOUR_HF_API_KEY"; // 🔑 put your key here

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const identifySpecies = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      // Convert file to binary for API upload
      const formData = await file.arrayBuffer();

      // Send image to Hugging Face
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: formData,
      });

      const predictions = await response.json();

      if (!Array.isArray(predictions)) {
        throw new Error("Invalid model response");
      }

      // Get top prediction
      const top = predictions[0];
      const predictedName = top.label;

      // Fetch species info from GBIF
      const gbifRes = await fetch(
        `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(
          predictedName
        )}`
      );
      const gbifData = await gbifRes.json();

      setResult({
        name: predictedName,
        confidence: top.score,
        gbif: gbifData,
      });
    } catch (err) {
      console.error("Error identifying species:", err);
      setResult({ error: "Failed to identify species" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Upload className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Upload Species Image</h2>
      </div>
      <div className="space-y-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        <button
          onClick={identifySpecies}
          disabled={!file || loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
        >
          {loading ? "Identifying..." : "Identify Species"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-white/5 border border-white/20 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-3">Result:</h3>
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">Name:</strong> {result.name}</p>
              <p><strong className="text-white">Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
              <p><strong className="text-white">GBIF Info:</strong> {JSON.stringify(result.gbif)}</p>
            </div>
          )}
        </div>
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

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExport = (format: string) => {
    console.log(`Export ${format}`);
  };

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
            <div className="flex items-center space-x-2 mb-2">
              <Search className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">Species Identification</h1>
            </div>
            <p className="text-gray-400 mb-8">
              Identify marine species using AI-powered image recognition
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <SpeciesUpload />
              </div>

              <div className="space-y-4">
                <motion.div
                  className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Information</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-300">
                    <p>• Upload clear images of marine species</p>
                    <p>• AI-powered recognition powered by ResNet-50</p>
                    <p>• Get detailed species information from GBIF</p>
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
