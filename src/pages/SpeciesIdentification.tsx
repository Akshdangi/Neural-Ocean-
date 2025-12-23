/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";

export default function SpeciesUpload() {
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
      className="p-6 bg-white shadow rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold mb-4">Upload Species Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={identifySpecies}
        disabled={!file || loading}
        className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Identifying..." : "Identify Species"}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Result:</h3>
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <div className="mt-2 space-y-2">
              <p><strong>Name:</strong> {result.name}</p>
              <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
              <p><strong>GBIF Info:</strong> {JSON.stringify(result.gbif)}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
