/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Thermometer,
  Waves,
  Fish,
  Zap,
  Activity,
  Navigation,
  Camera,
  MapPin,
} from "lucide-react";

declare global {
  interface Window {
    Cesium: any;
  }
}

interface Cesium3DOceanProps {
  className?: string;
}


// Define the possible keys as a separate type to avoid circular reference
type LayerKey = "temperature" | "salinity" | "fishMigration" | "eDNAHotspots" | "models" | "bathymetry";

interface LayerConfig {
  key: LayerKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  defaultActive?: boolean;
}

const layerConfigs: LayerConfig[] = [
  { key: "temperature", label: "Temperature", icon: Thermometer, color: "orange-400" },
  { key: "salinity", label: "Salinity", icon: Waves, color: "cyan-400" },
  { key: "fishMigration", label: "Fish Migration", icon: Fish, color: "green-400" },
  { key: "eDNAHotspots", label: "eDNA Hotspots", icon: Zap, color: "purple-400" },
  { key: "models", label: "3D Models", icon: Camera, color: "blue-400" },
  { key: "bathymetry", label: "Bathymetry", icon: Navigation, color: "gray-400", defaultActive: false },
];

const initialActiveLayers = layerConfigs.reduce((acc, layer) => {
  acc[layer.key] = layer.defaultActive ?? true;
  return acc;
}, {} as Record<LayerKey, boolean>);

function Cesium3DOcean({ className = "" }: Cesium3DOceanProps) {
  const cesiumContainer = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const updateIntervalRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [cesiumLoaded, setCesiumLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeLayers, setActiveLayers] = useState(initialActiveLayers);

  const [liveData, setLiveData] = useState({
    temperature: 23.2,
    species: 1247,
    eDNACoverage: 87,
    activity: "HIGH",
    activeSensors: 156,
    dataPoints: "2.4M",
  });

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers((prev: Record<LayerKey, boolean>) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Update live data every 3s
  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentTime(new Date());
      setLiveData((prev) => ({
        temperature: +(prev.temperature + (Math.random() - 0.5) * 0.2).toFixed(1),
        species: Math.max(0, prev.species + Math.floor(Math.random() * 10 - 5)),
        eDNACoverage: Math.max(50, Math.min(99, prev.eDNACoverage + Math.floor(Math.random() * 6 - 3))),
        activity: Math.random() > 0.85 ? "CRITICAL" : Math.random() > 0.45 ? "HIGH" : "MODERATE",
        activeSensors: Math.max(0, prev.activeSensors + Math.floor(Math.random() * 4 - 2)),
        dataPoints: prev.dataPoints,
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let cssEl: HTMLLinkElement | null = null;
    let scriptEl: HTMLScriptElement | null = null;
    let fallbackTimeout: number | null = null;

    const cleanup = () => {
      try {
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }
      } catch (e) {}
      if (cssEl && cssEl.parentNode) cssEl.parentNode.removeChild(cssEl);
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
    };

    const loadCesium = () => {
      setIsLoading(true);
      fallbackTimeout = window.setTimeout(() => {
        if (isMounted && !window.Cesium) {
          setLoadingError("Cesium failed to load (timeout)");
          setIsLoading(false);
        }
      }, 12000);

      cssEl = document.createElement("link");
      cssEl.rel = "stylesheet";
      cssEl.href = "https://unpkg.com/cesium@1.111.0/Build/Cesium/Widgets/widgets.css";
      document.head.appendChild(cssEl);

      scriptEl = document.createElement("script");
      scriptEl.src = "https://unpkg.com/cesium@1.111.0/Build/Cesium/Cesium.js";
      scriptEl.async = true;
      scriptEl.onload = () => {
        if (!isMounted || !window.Cesium) return;
        setCesiumLoaded(true);
        try {
          initializeCesium();
        } catch (err) {
          setLoadingError(String(err));
        } finally {
          setIsLoading(false);
          if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
        }
      };
      scriptEl.onerror = () => {
        setLoadingError("Failed to load Cesium script");
        setIsLoading(false);
        if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
      };
      document.body.appendChild(scriptEl);
    };

    const initializeCesium = () => {
      const Cesium = window.Cesium;
      if (!Cesium || !cesiumContainer.current) return;

      // Set your Cesium Ion access token here
      Cesium.Ion.defaultAccessToken = 'your_cesium_ion_access_token_here'; // Sign up for free at https://cesium.com/ion/

      viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
        baseLayerPicker: true,
        geocoder: true,
        homeButton: true,
        sceneModePicker: true,
        navigationHelpButton: true,
        animation: false,
        timeline: false,
        fullscreenButton: true,
        vrButton: false,
        infoBox: true,
        selectionIndicator: true,
        shadows: true,
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        }),
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: Cesium.IonResource.fromAssetId(1), // Default world terrain
          requestVertexNormals: true,
          requestWaterMask: true,
        }),
        shouldAnimate: true,
        requestRenderMode: false,
      });

      const viewer = viewerRef.current;
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#000022");
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#001133");
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.highDynamicRange = true;
      viewer.scene.fog = new Cesium.Fog({
        enabled: true,
        density: 0.00015,
        minimumBrightness: 0.1,
      });
      viewer.scene.skyAtmosphere.brightnessShift = 0.1;

    viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(0.0, 25.0, 250000.0),
  orientation: {
    heading: Cesium.Math.toRadians(45.0),
    pitch: Cesium.Math.toRadians(-45.0),
    roll: 0.0
  },
  duration: 3  // fly animation in seconds
});


      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      // Attach helper functions to viewerRef for external access
      viewerRef.current._addStationEntities = addStationEntities;
      viewerRef.current._addMigrationRoutes = addMigrationRoutes;
      viewerRef.current._add3DModels = add3DModels;
      viewerRef.current._updateTerrain = updateTerrain;

      addStationEntities();
      if (activeLayers.fishMigration) addMigrationRoutes();
      if (activeLayers.models) add3DModels();
      updateTerrain();

      if (updateIntervalRef.current) window.clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = window.setInterval(() => {
        addStationEntities();
      }, 5000);
    };

    const updateTerrain = () => {
      const Cesium = window.Cesium;
      const viewer = viewerRef.current;
      if (!viewer || !Cesium) return;

      // To expand bathymetry options, add more asset IDs or providers here
      const assetId = activeLayers.bathymetry ? 2426648 : 1;
      viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(assetId),
        requestVertexNormals: true,
        requestWaterMask: true,
      });
    };

    // Station entities - expandable by adding more objects to the stations array
    const addStationEntities = () => {
      const Cesium = window.Cesium;
      const viewer = viewerRef.current;
      if (!viewer || !Cesium) return;

      // Remove old stations
      viewer.entities.values.filter((e: any) => e.properties?._isLiveStation).forEach((e: any) => viewer.entities.remove(e));

      // Expandable stations data - add more stations here as needed
      const stations = [
        { lon: -40, lat: 35, type: "temperature", value: liveData.temperature, color: Cesium.Color.ORANGE, region: "North Atlantic", height: 300000 },
        { lon: -35, lat: 30, type: "salinity", value: 35.2, color: Cesium.Color.CYAN, region: "North Atlantic", height: 350000 },
        { lon: -45, lat: 25, type: "edna", value: liveData.eDNACoverage, color: Cesium.Color.PURPLE, region: "North Atlantic", height: 320000 },
        { lon: -30, lat: 40, type: "fish", value: 156, color: Cesium.Color.LIME, region: "North Atlantic", height: 380000 },
        { lon: -150, lat: 20, type: "temperature", value: 24.8, color: Cesium.Color.RED, region: "Pacific", height: 400000 },
        { lon: -160, lat: 25, type: "salinity", value: 34.8, color: Cesium.Color.BLUE, region: "Pacific", height: 360000 },
        { lon: -140, lat: 30, type: "edna", value: 92, color: Cesium.Color.MAGENTA, region: "Pacific", height: 340000 },
        { lon: -170, lat: 15, type: "fish", value: 203, color: Cesium.Color.GREEN, region: "Pacific", height: 420000 },
        { lon: 70, lat: -10, type: "temperature", value: 26.3, color: Cesium.Color.YELLOW, region: "Indian Ocean", height: 330000 },
        { lon: 80, lat: -15, type: "salinity", value: 35.5, color: Cesium.Color.LIGHTBLUE, region: "Indian Ocean", height: 310000 },
        { lon: 90, lat: -5, type: "edna", value: 78, color: Cesium.Color.VIOLET, region: "Indian Ocean", height: 370000 },
        { lon: 15, lat: 40, type: "temperature", value: 20.8, color: Cesium.Color.ORANGERED, region: "Mediterranean", height: 290000 },
        { lon: 10, lat: 42, type: "fish", value: 89, color: Cesium.Color.LIGHTGREEN, region: "Mediterranean", height: 300000 },
        { lon: 0, lat: 80, type: "temperature", value: -1.2, color: Cesium.Color.LIGHTCYAN, region: "Arctic", height: 250000 },
      ];

      stations.forEach((s) => {
        const allowed =
          (s.type === "temperature" && activeLayers.temperature) ||
          (s.type === "salinity" && activeLayers.salinity) ||
          (s.type === "edna" && activeLayers.eDNAHotspots) ||
          (s.type === "fish" && activeLayers.fishMigration);
        if (!allowed) return;

        const unit = s.type === "temperature" ? "°C" : s.type === "salinity" ? " PSU" : s.type === "edna" ? "%" : "";

        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(s.lon, s.lat, s.height),
          billboard: { image: makePingCanvas(64, s.color), verticalOrigin: Cesium.VerticalOrigin.CENTER },
          label: { 
            text: `${s.type.toUpperCase()} ${s.value}${unit}\n${s.region}`, 
            font: "13pt sans-serif", 
            style: Cesium.LabelStyle.FILL_AND_OUTLINE, 
            outlineWidth: 3, 
            pixelOffset: new Cesium.Cartesian2(0, -40), 
            showBackground: true, 
            backgroundColor: Cesium.Color.fromAlpha(Cesium.Color.BLACK, 0.6), 
            disableDepthTestDistance: Number.POSITIVE_INFINITY 
          },
          properties: { _isLiveStation: true },
        });
      });
    };

    // Migration routes - expandable by adding more routes to the routes array
    const addMigrationRoutes = () => {
      const Cesium = window.Cesium;
      const viewer = viewerRef.current;
      if (!viewer || !Cesium || !activeLayers.fishMigration) return;

      // Remove old routes
      viewer.entities.values.filter((e: any) => e.properties?._isMigration).forEach((e: any) => viewer.entities.remove(e));

      // Expandable routes data - add more routes here as needed
      const routes = [
        { 
          name: "Atlantic Tuna Migration", 
          path: [
            { lon: -70, lat: 50, height: 200000 }, 
            { lon: -60, lat: 45, height: 250000 }, 
            { lon: -50, lat: 40, height: 300000 }, 
            { lon: -40, lat: 35, height: 350000 }, 
            { lon: -30, lat: 30, height: 300000 }, 
            { lon: -20, lat: 25, height: 250000 }
          ], 
          color: Cesium.Color.CYAN 
        },
        { 
          name: "Pacific Salmon Route", 
          path: [
            { lon: -160, lat: 60, height: 220000 }, 
            { lon: -150, lat: 55, height: 270000 }, 
            { lon: -140, lat: 50, height: 320000 }, 
            { lon: -130, lat: 45, height: 370000 }, 
            { lon: -120, lat: 40, height: 320000 }, 
            { lon: -110, lat: 35, height: 270000 }
          ], 
          color: Cesium.Color.LIME 
        },
        { 
          name: "Indian Ocean Currents", 
          path: [
            { lon: 60, lat: -20, height: 180000 }, 
            { lon: 70, lat: -15, height: 230000 }, 
            { lon: 80, lat: -10, height: 280000 }, 
            { lon: 90, lat: -5, height: 330000 }, 
            { lon: 100, lat: 0, height: 280000 }
          ], 
          color: Cesium.Color.YELLOW 
        },
      ];

      routes.forEach((r) => {
        viewer.entities.add({
          polyline: { 
            positions: r.path.map((p) => Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height)), 
            width: 12, 
            material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.9, color: r.color.withAlpha(0.85) }), 
            clampToGround: false 
          },
          properties: { _isMigration: true, name: r.name },
        });
        const mid = r.path[Math.floor(r.path.length / 2)];
        viewer.entities.add({ 
          position: Cesium.Cartesian3.fromDegrees(mid.lon, mid.lat, mid.height + 100000), 
          label: { 
            text: `🐟 ${r.name}`, 
            font: "14pt sans-serif", 
            fillColor: r.color, 
            outlineColor: Cesium.Color.BLACK, 
            outlineWidth: 3, 
            showBackground: true, 
            backgroundColor: Cesium.Color.fromAlpha(Cesium.Color.BLACK, 0.6), 
            disableDepthTestDistance: Number.POSITIVE_INFINITY 
          }, 
          properties: { _isMigration: true } 
        });
      });
    };

    // 3D models - expandable by adding more models to the models array
    const add3DModels = () => {
      const Cesium = window.Cesium;
      const viewer = viewerRef.current;
      if (!viewer || !Cesium || !activeLayers.models) return;

      // Remove old models
      viewer.entities.values.filter((e: any) => e.properties?._isSampleModel).forEach((e: any) => viewer.entities.remove(e));

      // Expandable models data - add more models here as needed
      const models = [
        { 
          name: "Sample 3D Model", 
          url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/WaterBottle/glTF-Binary/WaterBottle.glb", 
          position: { lon: -30, lat: 40, height: 0 }, 
          scale: 1000000, 
          minimumPixelSize: 128 
        },
        // Example: Add another model
        // { name: "Another Model", url: "https://example.com/model.glb", position: { lon: -50, lat: 30, height: 0 }, scale: 500000, minimumPixelSize: 64 },
      ];

      models.forEach((m) => {
        viewer.entities.add({ 
          name: m.name, 
          position: Cesium.Cartesian3.fromDegrees(m.position.lon, m.position.lat, m.position.height), 
          model: { uri: m.url, scale: m.scale, minimumPixelSize: m.minimumPixelSize },
          properties: { _isSampleModel: true } 
        });
      });
    };

    const makePingCanvas = (size = 64, color: any) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const rgba = cesiumColorToRgba(color);
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 1.5);
      grad.addColorStop(0, rgbaWithAlpha(rgba, 0.95));
      grad.addColorStop(0.5, rgbaWithAlpha(rgba, 0.6));
      grad.addColorStop(1, rgbaWithAlpha(rgba, 0.15));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
      return canvas;
    };

    const rgbaWithAlpha = (rgba: string, a: number) => `rgba(${rgba},${a})`;

    const cesiumColorToRgba = (c: any) => {
      try {
        if (c && c._rgba) return `${Math.round(c._rgba[0]*255)},${Math.round(c._rgba[1]*255)},${Math.round(c._rgba[2]*255)}`;
        if (c && c.red !== undefined) return `${Math.round(c.red*255)},${Math.round(c.green*255)},${Math.round(c.blue*255)}`;
      } catch(e){}
      return "255,255,255";
    };

    loadCesium();
    return () => { 
      isMounted = false; 
      if (updateIntervalRef.current) window.clearInterval(updateIntervalRef.current); 
      cleanup(); 
    };
  }, []);

  // Re-render on layer toggle
  useEffect(() => {
    if (!cesiumLoaded || isLoading || loadingError) return;
    try {
      const viewer = viewerRef.current;
      if (!viewer) return;
      viewer._addStationEntities?.();
      viewer._addMigrationRoutes?.();
      viewer._add3DModels?.();
      viewer._updateTerrain?.();
      viewer.scene.requestRender();
    } catch (e) { console.warn(e); }
  }, [activeLayers, cesiumLoaded, isLoading, loadingError, liveData]);

  return (
    <motion.div
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cesium Container */}
      <div
        ref={cesiumContainer}
        className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl border border-blue-900"
        style={{ minHeight: 600, background: "#001122" }}
      />
      {/* Overlay UI with improved styling */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 p-2 bg-gradient-to-br from-black/80 to-blue-900/80 rounded-xl shadow-xl">
        {/* Live Data Panel */}
        <div className="bg-black/70 rounded-lg p-4 text-white shadow-lg min-w-[240px] border border-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-6 h-6 text-blue-300 animate-spin-slow" />
            <span className="font-bold text-lg">Live Ocean Insights</span>
          </div>
          <div className="text-sm text-gray-200 mb-3">
            {currentTime.toLocaleString()}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <span>{liveData.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Fish className="w-5 h-5 text-green-400" />
              <span>{liveData.species} species</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>{liveData.activeSensors} sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              <span>{liveData.activity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              <span>{liveData.eDNACoverage}% eDNA</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-400" />
              <span>{liveData.dataPoints} pts</span>
            </div>
          </div>
        </div>
        {/* Layer Toggles - dynamically generated for expandability */}
        <div className="bg-black/70 rounded-lg p-4 text-white shadow-lg border border-blue-500">
          <div className="font-bold text-lg mb-3 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-300" />
            Data Layers
          </div>
          <div className="flex flex-col gap-2">
            {layerConfigs.map((layer) => {
              const Icon = layer.icon;
              return (
                <label key={layer.key} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={activeLayers[layer.key]}
                    onChange={() => toggleLayer(layer.key)}
                    className={`accent-${layer.color} w-4 h-4`}
                  />
                  <Icon className={`w-5 h-5 text-${layer.color}`} />
                  {layer.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>
      {/* Loading/Error Overlay */}
      {(isLoading || loadingError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 rounded-xl">
          {loadingError ? (
            <div className="text-red-400 text-xl font-bold p-4 bg-black/70 rounded-lg">
              {loadingError}
            </div>
          ) : (
            <div className="text-white text-xl font-bold animate-pulse p-4 bg-black/70 rounded-lg">
              Initializing 3D Ocean Explorer...
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
export default Cesium3DOcean;