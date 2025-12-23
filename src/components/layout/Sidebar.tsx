/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Calendar, MapPin, Filter, Download } from 'lucide-react';

interface SidebarProps {
  filters: {
    timeRange: string;
    location: string;
    dataType: string;
  };
  onFiltersChange: (filters: any) => void;
  onExport: (format: string) => void;
}

function Sidebar({ filters, onFiltersChange, onExport }: SidebarProps) {
  const timeRanges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year', 'All time'];
  const locations = ['Global', 'Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean', 'Mediterranean Sea'];
  const dataTypes = ['All Data', 'Fisheries', 'Biodiversity', 'eDNA', 'Oceanographic', 'Temperature'];

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 p-6 space-y-8"
    >
      {/* Time Range */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Time Range</h3>
        </div>
        <div className="space-y-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => onFiltersChange({ ...filters, timeRange: range })}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                filters.timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Location</h3>
        </div>
        <div className="space-y-2">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => onFiltersChange({ ...filters, location })}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                filters.location === location
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Data Type */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Data Type</h3>
        </div>
        <div className="space-y-2">
          {dataTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFiltersChange({ ...filters, dataType: type })}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                filters.dataType === type
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Download className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Export Data</h3>
        </div>
        <div className="space-y-2">
          {['CSV', 'JSON', 'PDF'].map((format) => (
            <button
              key={format}
              onClick={() => onExport(format)}
              className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Export as {format}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
