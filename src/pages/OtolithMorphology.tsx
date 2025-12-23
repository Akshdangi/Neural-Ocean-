/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/layout/Navigation";
import Sidebar from "../components/layout/Sidebar";
import { Microscope, Ruler, Camera, Brain, Loader2, Upload } from "lucide-react";

// === Default 20 datasets ===
const baseDatasets = [
  { id: 1, name: "Atlantic Tuna Stock Assessment 2024", type: "Fisheries", location: "Atlantic Ocean", date: "2024-01-15" },
  { id: 2, name: "Mediterranean Biodiversity Survey", type: "Biodiversity", location: "Mediterranean Sea", date: "2024-01-10" },
  { id: 3, name: "Pacific eDNA Sampling - Q4 2023", type: "eDNA", location: "Pacific Ocean", date: "2023-12-28" },
  { id: 4, name: "Arctic Ocean Temperature Profiles", type: "Oceanographic", location: "Arctic Ocean", date: "2023-12-20" },
  { id: 5, name: "Coral Reef Health Assessment", type: "Biodiversity", location: "Indian Ocean", date: "2023-12-15" },
  { id: 6, name: "North Sea Cod Population 2023", type: "Fisheries", location: "North Sea", date: "2023-11-22" },
  { id: 7, name: "Caribbean Coral Bleaching Events", type: "Biodiversity", location: "Caribbean Sea", date: "2023-11-05" },
  { id: 8, name: "Bay of Bengal Phytoplankton Census", type: "eDNA", location: "Bay of Bengal", date: "2023-10-18" },
  { id: 9, name: "Southern Ocean Salinity Trends", type: "Oceanographic", location: "Southern Ocean", date: "2023-09-27" },
  { id: 10, name: "Gulf of Mexico Shrimp Fisheries Report", type: "Fisheries", location: "Gulf of Mexico", date: "2023-09-10" },
  { id: 11, name: "Baltic Sea Biodiversity Index 2023", type: "Biodiversity", location: "Baltic Sea", date: "2023-08-30" },
  { id: 12, name: "Hawaiian Coral Reef eDNA Study", type: "eDNA", location: "Pacific Ocean", date: "2023-08-15" },
  { id: 13, name: "Norwegian Sea Temperature Series", type: "Oceanographic", location: "Norwegian Sea", date: "2023-07-20" },
  { id: 14, name: "South China Sea Fish Stock Data", type: "Fisheries", location: "South China Sea", date: "2023-07-01" },
  { id: 15, name: "Great Barrier Reef Species Catalog", type: "Biodiversity", location: "Coral Sea", date: "2023-06-14" },
  { id: 16, name: "California Current eDNA Archive", type: "eDNA", location: "Pacific Ocean", date: "2023-05-25" },
  { id: 17, name: "Antarctic Ice Shelf Temperature Records", type: "Oceanographic", location: "Southern Ocean", date: "2023-05-10" },
  { id: 18, name: "Black Sea Anchovy Fisheries Report", type: "Fisheries", location: "Black Sea", date: "2023-04-28" },
  { id: 19, name: "Red Sea Coral Biodiversity 2023", type: "Biodiversity", location: "Red Sea", date: "2023-04-12" },
  { id: 20, name: "Japan Coastal eDNA Pilot Study", type: "eDNA", location: "Pacific Ocean", date: "2023-03-30" },
];

// Morphology analysis
const analyzeOtoliths = (data: any[]) => {
  return data.map((sample) => {
    const length = (Math.random() * 4 + 2).toFixed(2); // 2–6 mm
    const width = (Math.random() * 2 + 0.5).toFixed(2); // 0.5–2.5 mm
    const aspectRatio = (parseFloat(length) / parseFloat(width)).toFixed(2);
    const circularity = (
      (4 * Math.PI * parseFloat(width) * parseFloat(length)) /
      Math.pow(parseFloat(length) + parseFloat(width), 2)
    ).toFixed(2);
    const predictedAge = Math.floor(parseFloat(length) * 2 + Math.random() * 3);

    return {
      ...sample,
      length,
      width,
      aspectRatio,
      circularity,
      predictedAge,
    };
  });
};

function OtolithMorphology() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    timeRange: "Last 30 days",
    location: "Global",
    dataType: "All Data",
  });

  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<any[]>(baseDatasets);
  const [results, setResults] = useState<any[]>([]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleExport = (format: string) => {
    console.log(`Export ${format}`);
  };

  const handleAnalysis = (newData = datasets) => {
    setLoading(true);
    setTimeout(() => {
      const analyzed = analyzeOtoliths(newData);
      setResults(analyzed);
      setLoading(false);
    }, 1500);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content); // Expect JSON dataset
        const newDataset = {
          id: datasets.length + 1,
          name: parsed.name || `Uploaded Dataset ${datasets.length + 1}`,
          type: parsed.type || "Unknown",
          location: parsed.location || "Unknown",
          date: new Date().toISOString().split("T")[0],
        };
        const updated = [...datasets, newDataset];
        setDatasets(updated);
        handleAnalysis(updated); // auto run analysis
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert("Invalid file format. Please upload JSON with fields: name, type, location.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen">
      <Navigation onLogout={handleLogout} />

      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={setFilters} onExport={handleExport} />

        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-white mb-2">Otolith Morphology</h1>
            <p className="text-gray-400 mb-8">
              Advanced otolith analysis for fish age determination and species identification
            </p>

            {/* Summary cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <Microscope className="w-8 h-8" />, title: "Microscopic Analysis", count: `${datasets.length} Datasets` },
                { icon: <Ruler className="w-8 h-8" />, title: "Morphometric Data", count: "Length / Width / Ratios" },
                { icon: <Camera className="w-8 h-8" />, title: "Image Processing", count: "Simulated AI Extracted" },
                { icon: <Brain className="w-8 h-8" />, title: "Age Prediction", count: "Based on Otolith Growth" },
              ].map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center">
                  <div className="text-purple-400 mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.count}</p>
                </motion.div>
              ))}
            </div>

            {/* Upload & Analysis Section */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 text-center">
              <Microscope className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Otolith Analysis Platform</h2>
              <p className="text-gray-300 mb-6">
                Upload new datasets (JSON format) or analyze existing 20 datasets automatically.
              </p>

              <div className="flex justify-center gap-4">
                <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Dataset
                  <input type="file" accept=".json" onChange={handleUpload} className="hidden" />
                </label>

                <button onClick={() => handleAnalysis()} disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center">
                  {loading && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
                  {loading ? "Analyzing..." : "Analyze All"}
                </button>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-10 overflow-x-auto">
                <h3 className="text-xl font-semibold text-white mb-4">Analysis Results</h3>
                <table className="min-w-full bg-white/10 text-white border border-white/20 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-white/20 text-left">
                      <th className="p-3">Dataset</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Length (mm)</th>
                      <th className="p-3">Width (mm)</th>
                      <th className="p-3">Aspect Ratio</th>
                      <th className="p-3">Circularity</th>
                      <th className="p-3">Predicted Age (yrs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-t border-white/20 hover:bg-white/5">
                        <td className="p-3">{r.name}</td>
                        <td className="p-3">{r.type}</td>
                        <td className="p-3">{r.location}</td>
                        <td className="p-3">{r.length}</td>
                        <td className="p-3">{r.width}</td>
                        <td className="p-3">{r.aspectRatio}</td>
                        <td className="p-3">{r.circularity}</td>
                        <td className="p-3">{r.predictedAge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default OtolithMorphology;
