/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import { ChevronDown, ChevronRight, TreePine } from 'lucide-react';

function Taxonomy() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [filters, setFilters] = useState({
    timeRange: 'Last 30 days',
    location: 'Global',
    dataType: 'All Data'
  });

  const [expandAll, setExpandAll] = useState(false);

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

  // ================== FULL REAL TAXONOMY DATA ==================
  const taxonomyData = [
    {
      name: "Fisheries",
      rank: "Category",
      children: [
        {
          name: "Animalia",
          rank: "Kingdom",
          children: [
            {
              name: "Chordata",
              rank: "Phylum",
              children: [
                {
                  name: "Actinopterygii",
                  rank: "Class",
                  children: [
                    {
                      name: "Scombriformes",
                      rank: "Order",
                      children: [
                        {
                          name: "Scombridae",
                          rank: "Family",
                          children: [
                            {
                              name: "Thunnus",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Thunnus thynnus",
                                  rank: "Species",
                                  children: [
                                    { name: "Atlantic Tuna Stock Assessment 2024", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "Gadiformes",
                      rank: "Order",
                      children: [
                        {
                          name: "Gadidae",
                          rank: "Family",
                          children: [
                            {
                              name: "Gadus",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Gadus morhua",
                                  rank: "Species",
                                  children: [
                                    { name: "North Sea Cod Population 2023", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "Clupeiformes",
                      rank: "Order",
                      children: [
                        {
                          name: "Clupeidae",
                          rank: "Family",
                          children: [
                            {
                              name: "Sardinella",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Sardinella longiceps",
                                  rank: "Species",
                                  children: [
                                    { name: "South China Sea Fish Stock Data", rank: "Dataset" }
                                  ]
                                }
                              ]
                            },
                            {
                              name: "Engraulis",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Engraulis encrasicolus",
                                  rank: "Species",
                                  children: [
                                    { name: "Black Sea Anchovy Fisheries Report", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "Decapoda",
                      rank: "Order",
                      children: [
                        {
                          name: "Penaeidae",
                          rank: "Family",
                          children: [
                            {
                              name: "Penaeus",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Penaeus setiferus",
                                  rank: "Species",
                                  children: [
                                    { name: "Gulf of Mexico Shrimp Fisheries Report", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Biodiversity",
      rank: "Category",
      children: [
        {
          name: "Animalia",
          rank: "Kingdom",
          children: [
            {
              name: "Cnidaria",
              rank: "Phylum",
              children: [
                {
                  name: "Anthozoa",
                  rank: "Class",
                  children: [
                    {
                      name: "Scleractinia",
                      rank: "Order",
                      children: [
                        {
                          name: "Acroporidae",
                          rank: "Family",
                          children: [
                            {
                              name: "Acropora",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Acropora cervicornis",
                                  rank: "Species",
                                  children: [
                                    { name: "Coral Reef Health Assessment", rank: "Dataset" }
                                  ]
                                },
                                {
                                  name: "Acropora millepora",
                                  rank: "Species",
                                  children: [
                                    { name: "Great Barrier Reef Species Catalog", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          name: "Faviidae",
                          rank: "Family",
                          children: [
                            {
                              name: "Montastraea",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Montastraea cavernosa",
                                  rank: "Species",
                                  children: [
                                    { name: "Caribbean Coral Bleaching Events", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          name: "Pocilloporidae",
                          rank: "Family",
                          children: [
                            {
                              name: "Stylophora",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Stylophora pistillata",
                                  rank: "Species",
                                  children: [
                                    { name: "Red Sea Coral Biodiversity 2023", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "Plantae",
              rank: "Kingdom",
              children: [
                {
                  name: "Tracheophyta",
                  rank: "Phylum",
                  children: [
                    {
                      name: "Posidoniaceae",
                      rank: "Family",
                      children: [
                        {
                          name: "Posidonia",
                          rank: "Genus",
                          children: [
                            {
                              name: "Posidonia oceanica",
                              rank: "Species",
                              children: [
                                { name: "Mediterranean Biodiversity Survey", rank: "Dataset" }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "Ochrophyta",
              rank: "Phylum",
              children: [
                {
                  name: "Phaeophyceae",
                  rank: "Class",
                  children: [
                    {
                      name: "Fucales",
                      rank: "Order",
                      children: [
                        {
                          name: "Fucaceae",
                          rank: "Family",
                          children: [
                            {
                              name: "Fucus",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Fucus vesiculosus",
                                  rank: "Species",
                                  children: [
                                    { name: "Baltic Sea Biodiversity Index 2023", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "eDNA",
      rank: "Category",
      children: [
        {
          name: "Animalia",
          rank: "Kingdom",
          children: [
            {
              name: "Chordata",
              rank: "Phylum",
              children: [
                {
                  name: "Actinopterygii",
                  rank: "Class",
                  children: [
                    {
                      name: "Scombriformes",
                      rank: "Order",
                      children: [
                        {
                          name: "Scombridae",
                          rank: "Family",
                          children: [
                            {
                              name: "Scomber",
                              rank: "Genus",
                              children: [
                                {
                                  name: "Scomber japonicus",
                                  rank: "Species",
                                  children: [
                                    { name: "Japan Coastal eDNA Pilot Study", rank: "Dataset" }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "Cnidaria",
              rank: "Phylum",
              children: [
                {
                  name: "Anthozoa",
                  rank: "Class",
                  children: [
                    {
                      name: "Poritidae",
                      rank: "Family",
                      children: [
                        {
                          name: "Porites",
                          rank: "Genus",
                          children: [
                            {
                              name: "Porites lobata",
                              rank: "Species",
                              children: [
                                { name: "Hawaiian Coral Reef eDNA Study", rank: "Dataset" }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "Arthropoda",
              rank: "Phylum",
              children: [
                {
                  name: "Copepoda",
                  rank: "Order",
                  children: [
                    {
                      name: "Calanidae",
                      rank: "Family",
                      children: [
                        {
                          name: "Calanus",
                          rank: "Genus",
                          children: [
                            {
                              name: "Calanus pacificus",
                              rank: "Species",
                              children: [
                                { name: "California Current eDNA Archive", rank: "Dataset" }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "Cyanobacteria",
              rank: "Phylum",
              children: [
                {
                  name: "Trichodesmium",
                  rank: "Genus",
                  children: [
                    {
                      name: "Trichodesmium erythraeum",
                      rank: "Species",
                      children: [
                        { name: "Bay of Bengal Phytoplankton Census", rank: "Dataset" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Oceanographic",
      rank: "Category",
      children: [
        {
          name: "Environmental Data",
          rank: "Non-biological",
          children: [
            { name: "Arctic Ocean Temperature Profiles", rank: "Dataset" },
            { name: "Southern Ocean Salinity Trends", rank: "Dataset" },
            { name: "Norwegian Sea Temperature Series", rank: "Dataset" },
            { name: "Antarctic Ice Shelf Temperature Records", rank: "Dataset" }
          ]
        }
      ]
    }
  ];

  // ================== UI HELPERS ==================
  const rankStyle = (rank: string) => {
    switch (rank) {
      case 'Category': return 'bg-cyan-500/20 text-cyan-400';
      case 'Kingdom': return 'bg-purple-500/20 text-purple-400';
      case 'Phylum': return 'bg-blue-500/20 text-blue-400';
      case 'Class': return 'bg-indigo-500/20 text-indigo-400';
      case 'Order': return 'bg-pink-500/20 text-pink-400';
      case 'Family': return 'bg-yellow-500/20 text-yellow-400';
      case 'Genus': return 'bg-orange-500/20 text-orange-400';
      case 'Species': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const TaxonomyNode = ({ node }: { node: any }) => {
    const [expanded, setExpanded] = useState(expandAll);

    return (
      <div className="ml-4">
        <div
          className="flex items-center cursor-pointer text-gray-200 hover:text-green-400"
          onClick={() => setExpanded(!expanded)}
        >
          {node.children ? (
            expanded ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />
          ) : (
            <span className="w-4 h-4 mr-2 inline-block" />
          )}

          <span className="font-medium">
            {node.rank === 'Dataset' ? '📄 ' : ''}
            {node.name}
          </span>

          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${rankStyle(node.rank)}`}>
            {node.rank}
          </span>
        </div>

        {expanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="ml-6 border-l border-gray-700 pl-4"
          >
            {node.children.map((child: any, index: number) => (
              <TaxonomyNode key={index} node={child} />
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Navigation onLogout={handleLogout} />

      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={setFilters} onExport={handleExport} />

        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-2">Marine Taxonomy</h1>
            <p className="text-gray-400 mb-6">
              Full hierarchical classification of the 20 marine datasets into scientific taxonomy.
            </p>

            <div className="flex gap-4 mb-6">
              <button onClick={() => setExpandAll(true)} className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg">
                Expand All
              </button>
              <button onClick={() => setExpandAll(false)} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg">
                Collapse All
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-white/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <TreePine className="w-6 h-6 text-green-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">Taxonomic Tree</h2>
              </div>

              {taxonomyData.map((root, index) => (
                <TaxonomyNode key={index} node={root} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Taxonomy;
