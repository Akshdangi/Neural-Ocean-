/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Calendar, MapPin, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

interface DatasetTableProps {
  searchTerm: string;
  filters: {
    timeRange: string;
    location: string;
    dataType: string;
  };
}

function DatasetTable({ searchTerm, filters }: DatasetTableProps) {
  const { addNotification } = useNotifications();
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

   // Mock dataset data
  const datasets = [
    {
      id: 1,
      name: 'Atlantic Tuna Stock Assessment 2024',
      type: 'Fisheries',
      location: 'Atlantic Ocean',
      date: '2024-01-15',
      size: '2.4 MB',
      records: 15420,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 2,
      name: 'Mediterranean Biodiversity Survey',
      type: 'Biodiversity',
      location: 'Mediterranean Sea',
      date: '2024-01-10',
      size: '1.8 MB',
      records: 8930,
      format: 'JSON',
      status: 'Processing'
    },
    {
      id: 3,
      name: 'Pacific eDNA Sampling - Q4 2023',
      type: 'eDNA',
      location: 'Pacific Ocean',
      date: '2023-12-28',
      size: '5.2 MB',
      records: 32150,
      format: 'FASTA',
      status: 'Processed'
    },
    {
      id: 4,
      name: 'Arctic Ocean Temperature Profiles',
      type: 'Oceanographic',
      location: 'Arctic Ocean',
      date: '2023-12-20',
      size: '3.1 MB',
      records: 18745,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 5,
      name: 'Coral Reef Health Assessment',
      type: 'Biodiversity',
      location: 'Indian Ocean',
      date: '2023-12-15',
      size: '4.7 MB',
      records: 25680,
      format: 'JSON',
      status: 'Processed'
    },
    {
      id: 6,
      name: 'North Sea Cod Population 2023',
      type: 'Fisheries',
      location: 'North Sea',
      date: '2023-11-22',
      size: '2.9 MB',
      records: 14300,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 7,
      name: 'Caribbean Coral Bleaching Events',
      type: 'Biodiversity',
      location: 'Caribbean Sea',
      date: '2023-11-05',
      size: '3.3 MB',
      records: 11900,
      format: 'JSON',
      status: 'Processing'
    },
    {
      id: 8,
      name: 'Bay of Bengal Phytoplankton Census',
      type: 'eDNA',
      location: 'Bay of Bengal',
      date: '2023-10-18',
      size: '6.4 MB',
      records: 40500,
      format: 'FASTA',
      status: 'Processed'
    },
    {
      id: 9,
      name: 'Southern Ocean Salinity Trends',
      type: 'Oceanographic',
      location: 'Southern Ocean',
      date: '2023-09-27',
      size: '2.6 MB',
      records: 13250,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 10,
      name: 'Gulf of Mexico Shrimp Fisheries Report',
      type: 'Fisheries',
      location: 'Gulf of Mexico',
      date: '2023-09-10',
      size: '2.2 MB',
      records: 9800,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 11,
      name: 'Baltic Sea Biodiversity Index 2023',
      type: 'Biodiversity',
      location: 'Baltic Sea',
      date: '2023-08-30',
      size: '4.0 MB',
      records: 17600,
      format: 'JSON',
      status: 'Processed'
    },
    {
      id: 12,
      name: 'Hawaiian Coral Reef eDNA Study',
      type: 'eDNA',
      location: 'Pacific Ocean',
      date: '2023-08-15',
      size: '7.5 MB',
      records: 50230,
      format: 'FASTA',
      status: 'Processing'
    },
    {
      id: 13,
      name: 'Norwegian Sea Temperature Series',
      type: 'Oceanographic',
      location: 'Norwegian Sea',
      date: '2023-07-20',
      size: '3.7 MB',
      records: 14850,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 14,
      name: 'South China Sea Fish Stock Data',
      type: 'Fisheries',
      location: 'South China Sea',
      date: '2023-07-01',
      size: '2.5 MB',
      records: 12500,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 15,
      name: 'Great Barrier Reef Species Catalog',
      type: 'Biodiversity',
      location: 'Coral Sea',
      date: '2023-06-14',
      size: '5.8 MB',
      records: 38900,
      format: 'JSON',
      status: 'Processed'
    },
    {
      id: 16,
      name: 'California Current eDNA Archive',
      type: 'eDNA',
      location: 'Pacific Ocean',
      date: '2023-05-25',
      size: '8.2 MB',
      records: 61200,
      format: 'FASTA',
      status: 'Processed'
    },
    {
      id: 17,
      name: 'Antarctic Ice Shelf Temperature Records',
      type: 'Oceanographic',
      location: 'Southern Ocean',
      date: '2023-05-10',
      size: '4.1 MB',
      records: 22000,
      format: 'CSV',
      status: 'Processed'
    },
    {
      id: 18,
      name: 'Black Sea Anchovy Fisheries Report',
      type: 'Fisheries',
      location: 'Black Sea',
      date: '2023-04-28',
      size: '1.9 MB',
      records: 8200,
      format: 'CSV',
      status: 'Processing'
    },
    {
      id: 19,
      name: 'Red Sea Coral Biodiversity 2023',
      type: 'Biodiversity',
      location: 'Red Sea',
      date: '2023-04-12',
      size: '4.9 MB',
      records: 27850,
      format: 'JSON',
      status: 'Processed'
    },
    {
      id: 20,
      name: 'Japan Coastal eDNA Pilot Study',
      type: 'eDNA',
      location: 'Pacific Ocean',
      date: '2023-03-30',
      size: '6.7 MB',
      records: 43120,
      format: 'FASTA',
      status: 'Processed'
    }
  ];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.dataType === 'All Data' || dataset.type === filters.dataType;
    const matchesLocation = filters.location === 'Global' || dataset.location.includes(filters.location);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleView = (dataset: any) => {
    addNotification({
      type: 'info',
      title: 'Dataset Preview',
      message: `Opening preview for ${dataset.name}`
    });
  };

  const handleDownload = (dataset: any, format: string) => {
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: `Downloading ${dataset.name} in ${format} format`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Processed':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Processed</span>;
      case 'Processing':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">Processing</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDatasets = filteredDatasets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Available Datasets</h3>
          <div className="text-sm text-gray-400">
            Showing {paginatedDatasets.length} of {filteredDatasets.length} datasets
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th 
                className="text-left p-4 text-gray-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Dataset Name</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="text-left p-4 text-gray-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-2">
                  <span>Type</span>
                  <SortIcon field="type" />
                </div>
              </th>
              <th 
                className="text-left p-4 text-gray-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center space-x-2">
                  <span>Location</span>
                  <SortIcon field="location" />
                </div>
              </th>
              <th 
                className="text-left p-4 text-gray-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-2">
                  <span>Date</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th className="text-left p-4 text-gray-300 font-medium">Records</th>
              <th className="text-left p-4 text-gray-300 font-medium">Status</th>
              <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDatasets.map((dataset, index) => (
              <motion.tr
                key={dataset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">{dataset.name}</div>
                      <div className="text-sm text-gray-400">{dataset.format} • {dataset.size}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dataset.type === 'Fisheries' ? 'bg-blue-500/20 text-blue-400' :
                    dataset.type === 'Biodiversity' ? 'bg-green-500/20 text-green-400' :
                    dataset.type === 'eDNA' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {dataset.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{dataset.location}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(dataset.date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="p-4 text-white font-medium">
                  {dataset.records.toLocaleString()}
                </td>
                <td className="p-4">
                  {getStatusBadge(dataset.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(dataset)}
                      className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                      title="View Dataset"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => handleDownload(dataset, 'CSV')}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded"
                          >
                            Download CSV
                          </button>
                          <button
                            onClick={() => handleDownload(dataset, 'JSON')}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded"
                          >
                            Download JSON
                          </button>
                          <button
                            onClick={() => handleDownload(dataset, 'PDF')}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded"
                          >
                            Download PDF Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-white/20 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white rounded-lg transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white rounded-lg transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DatasetTable;