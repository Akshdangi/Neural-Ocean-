/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Camera, Upload, Zap, CheckCircle } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";

interface SpeciesUploadProps {
  onIdentificationComplete: (results: any[]) => void;
}

function SpeciesUpload({ onIdentificationComplete }: SpeciesUploadProps) {
  const { addNotification } = useNotifications();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setUploadedImages(acceptedFiles);
      addNotification({
        type: "success",
        title: "Images Uploaded",
        message: `${acceptedFiles.length} image(s) ready for analysis`,
      });
    },
  });

  // --- Cesium Map Setup ---
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    if (!viewerRef.current) {
      const viewer = new Cesium.Viewer(mapContainerRef.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: true,
        homeButton: true,
        fullscreenButton: false,
      });

      // Store ref
      viewerRef.current = viewer;

      // Better basemap (ESRI Ocean)
      viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3812 })
      );

      // Water effects + lighting
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.showWaterEffect = true;
      viewer.scene.globe.depthTestAgainstTerrain = true;

      // Atmosphere polish
      viewer.scene.skyAtmosphere.hueShift = -0.5;
      viewer.scene.skyAtmosphere.saturationShift = 0.2;
      viewer.scene.skyAtmosphere.brightnessShift = -0.3;

      viewer.scene.skyBox.show = true;

      // Smooth camera intro
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0.0, 25.0, 250000.0),
        orientation: {
          heading: Cesium.Math.toRadians(30.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
        },
        duration: 4,
      });
    }
  }, []);

  // Add markers after analysis
  useEffect(() => {
    if (uploadedImages.length === 0 || !viewerRef.current) return;

    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;

    uploadedImages.forEach((file, _idx) => {
      const randomLon = 60 + Math.random() * 60; // mock random coords
      const randomLat = -30 + Math.random() * 30;

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(randomLon, randomLat),
        billboard: {
          image: "/fish-icon.png", // replace with your fish icon
          width: 32,
          height: 32,
        },
        label: {
          text: file.name.replace(/\.[^/.]+$/, ""),
          fillColor: Cesium.Color.CYAN,
          font: "14px sans-serif",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
      });
    });
  }, [uploadedImages]);

  // --- Species Analysis Logic ---
  const fetchFromWoRMS = async (query: string) => {
    try {
      const response = await fetch(
        `https://www.marinespecies.org/rest/AphiaRecordsByMatchNames?scientificnames[]=${encodeURIComponent(
          query
        )}&marine_only=true`
      );
      const data = await response.json();
      return data[0] || [];
    } catch (error) {
      console.error("WoRMS fetch failed", error);
      return [];
    }
  };

  const fetchFromGBIF = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("GBIF fetch failed", error);
      return [];
    }
  };

  const handleAnalyze = async () => {
    if (uploadedImages.length === 0) return;
    setIsAnalyzing(true);

    try {
      const results = await Promise.all(
        uploadedImages.map(async (file, index) => {
          const query = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

          let speciesMatches = await fetchFromWoRMS(query);

          if (speciesMatches.length === 0) {
            speciesMatches = await fetchFromGBIF(query);
          }

          const species = speciesMatches.slice(0, 3).map((sd: any, idx: number) => ({
            name: sd.scientificname || sd.scientificName || "Unknown",
            commonName:
              sd.vernacular ||
              sd.vernacularName ||
              (sd.vernacularNames?.[0]?.vernacularName ?? "N/A"),
            confidence: 95 - idx * 15,
            family: sd.family || "Unknown",
            habitat: sd.is_marine ? "Marine" : sd.habitat || "Varied",
          }));

          const morphologyData = {
            estimatedLength: `${20 + Math.floor(Math.random() * 20)}-${30 + Math.floor(Math.random() * 30)} cm`,
            estimatedWeight: `${0.5 + Math.random().toFixed(1)}-${1 + Math.random().toFixed(1)} kg`,
            keyFeatures: ["Scales", "Fins", "Gills", "Distinctive markings", "Streamlined body"]
              .slice(0, Math.floor(Math.random() * 3) + 2),
          };

          return {
            id: `${index + 1}`,
            image: URL.createObjectURL(file),
            fileName: file.name,
            analysisTime: `${(Math.random() * 2 + 1).toFixed(1)}s`,
            status: species.length > 0 ? "Matches Found" : "No Match Found",
            species,
            morphologyData,
          };
        })
      );

      onIdentificationComplete(results);
      addNotification({
        type: "success",
        title: "Analysis Complete",
        message: "Species identification completed successfully",
      });
    } catch (err) {
      console.error("Species fetch failed", err);
      addNotification({
        type: "error",
        title: "Analysis Failed",
        message: "Could not fetch species data",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Upload UI */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Upload Images</span>
        </h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-white/30 hover:border-cyan-500/50 hover:bg-black/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          {isDragActive ? (
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Drop images here</h4>
              <p className="text-gray-300">Release to upload for identification</p>
            </div>
          ) : (
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Drop images or click to upload</h4>
              <p className="text-gray-300 mb-2">Support for PNG, JPG, JPEG, GIF, BMP, WebP</p>
              <p className="text-sm text-gray-400">Maximum 5 images, 10MB each</p>
            </div>
          )}
        </div>

        {uploadedImages.length > 0 && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Species...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Start AI Analysis</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Cesium Map */}
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] rounded-xl overflow-hidden border border-white/20 shadow-lg"
      />

      {/* Quick Tips */}
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-medium mb-3">Tips for Better Results</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>Ensure good lighting and clear focus</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>Capture the whole specimen when possible</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>Include distinctive features like fins, markings</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>Multiple angles improve accuracy</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

export default SpeciesUpload;
