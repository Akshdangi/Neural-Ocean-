/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Calendar, MapPin, Filter, Download, Database } from 'lucide-react';

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
                ? `bg-black/50 text-white border border-white/[0.1]`
                : `text-gray-500 hover:bg-black/30 hover:text-gray-300 border border-transparent`
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">{item}</span>
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
      className="w-80 bg-black/40 backdrop-blur-3xl border-r border-white/[0.05] flex flex-col h-screen overflow-hidden"
    >
      <div className="p-8 border-b border-white/[0.05] relative overflow-hidden group">
        <div className="absolute inset-0 bg-biolum-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -left-full top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg] group-hover:animate-[shimmer_2s_infinite]" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] flex items-center justify-center border border-biolum-teal/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] relative">
            <div className="absolute inset-0 border border-biolum-teal/50 rounded-lg animate-ping opacity-20" />
            <Database className="w-5 h-5 text-biolum-teal" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black tracking-[0.15em] uppercase bg-gradient-to-r from-white via-biolum-teal to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              NEURAL<br/>OCEAN
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-biolum-emerald animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
              <span className="text-[8px] font-mono tracking-widest text-biolum-emerald uppercase">SYS_ONLINE // v2.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
        <FilterSection
          title="Time Range"
          icon={Calendar}
          items={timeRanges}
          filter="timeRange"
          color="cyan"
        />

        <FilterSection
          title="Location"
          icon={MapPin}
          items={locations}
          filter="location"
          color="green"
        />

        <div className="p-4 border-t border-white/[0.05]">
          <div className="bg-black/20 border border-white/[0.05] rounded-2xl p-4">
            <div className="text-xs tracking-widest uppercase font-bold text-gray-500 mb-2">Storage Used</div>
          </div>
        </div>

        <FilterSection
          title="Data Type"
          icon={Filter}
          items={dataTypes}
          filter="dataType"
          color="purple"
        />
      </div>

      <div className="p-6 border-t border-white/[0.05] bg-white/[0.01]">
        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Export Data</div>
        <div className="space-y-2">
          {['CSV', 'JSON', 'PDF'].map((format) => (
            <motion.button
              key={format}
              whileTap={{ scale: 0.98 }}
              onClick={() => onExport(format)}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-orange-300 bg-black/50 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/40 transition-all duration-300 font-medium flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export as {format}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
