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

  const FilterSection = ({ title, icon: Icon, items, filter, color }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
      <div className="flex items-center space-x-3 mb-5">
        <div className={`p-2.5 rounded-lg bg-gradient-to-br from-${color}-500/20 to-${color}-600/10`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-2.5">
        {items.map((item: string) => (
          <motion.button
            key={item}
            whileHover={{ x: 4 }}
            onClick={() => onFiltersChange({ ...filters, [filter]: item })}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              filters[filter] === item
                ? `bg-gradient-to-r from-${color}-500/30 to-${color}-400/10 text-${color}-300 border border-${color}-500/40 shadow-lg shadow-${color}-500/10`
                : `text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20`
            }`}
          >
            <div className="flex items-center space-x-2">
              {filters[filter] === item && (
                <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400`} />
              )}
              <span>{item}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-80 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-r border-white/20 p-8 space-y-10 max-h-screen overflow-y-auto"
    >
      <FilterSection
        title="Time Range"
        icon={Calendar}
        items={timeRanges}
        filter="timeRange"
        color="cyan"
      />

      <div className="border-t border-white/10" />

      <FilterSection
        title="Location"
        icon={MapPin}
        items={locations}
        filter="location"
        color="green"
      />

      <div className="border-t border-white/10" />

      <FilterSection
        title="Data Type"
        icon={Filter}
        items={dataTypes}
        filter="dataType"
        color="purple"
      />

      <div className="border-t border-white/10" />

      {/* Export */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10">
            <Download className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Export Data</h3>
        </div>
        <div className="space-y-2.5">
          {['CSV', 'JSON', 'PDF'].map((format) => (
            <motion.button
              key={format}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onExport(format)}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-orange-300 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/40 transition-all duration-300 font-medium flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export as {format}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}

export default Sidebar;
