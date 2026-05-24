/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
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

    // Sync expanded state when expandAll button is clicked
    useEffect(() => {
      setExpanded(expandAll);
    }, [expandAll]);

    return (
      <div className="relative">
        <div
          className="flex items-center cursor-pointer bg-black/40 hover:bg-black/60 border border-white/[0.05] hover:border-biolum-teal/40 rounded-2xl px-5 py-3.5 transition-all duration-300 w-fit backdrop-blur-xl shadow-xl group relative z-10"
          onClick={() => setExpanded(!expanded)}
        >
          {node.children ? (
            <div className={`w-6 h-6 rounded-full bg-white/5 flex items-center justify-center mr-3 transition-transform duration-300 ${expanded ? 'rotate-90 bg-biolum-teal/20 text-biolum-teal' : 'text-gray-400 group-hover:text-biolum-teal'}`}>
              <ChevronRight className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-6 h-6 mr-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-biolum-emerald/50 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-black tracking-wide text-white text-sm group-hover:text-biolum-teal transition-colors duration-300">
              {node.rank === 'Dataset' ? '📄 ' : ''}
              {node.name}
            </span>
          </div>

          <span className={`ml-6 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg border border-white/5 shadow-inner ${rankStyle(node.rank)}`}>
            {node.rank}
          </span>
        </div>

        {expanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="ml-8 relative mt-3 space-y-3 pb-2"
          >
            {/* Vertical Guide Line */}
            <div className="absolute top-0 bottom-6 -left-px w-[2px] bg-gradient-to-b from-biolum-teal/40 via-biolum-emerald/20 to-transparent rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
            
            {node.children.map((child: any, index: number) => (
              <div key={index} className="relative pl-8">
                {/* Horizontal Guide Line */}
                <div className="absolute top-[24px] left-0 w-8 h-[2px] bg-gradient-to-r from-biolum-teal/40 to-transparent rounded-r-full" />
                <TaxonomyNode node={child} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] selection:bg-biolum-teal/30 selection:text-biolum-teal">
      <Navigation onLogout={handleLogout} />

      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={setFilters} onExport={handleExport} />

        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-black tracking-tighter text-white mb-2">Marine Taxonomy</h1>
            <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold">
              Full hierarchical classification of the 20 marine datasets into scientific taxonomy.
            </p>

            <div className="flex gap-4 mb-10">
              <button onClick={() => setExpandAll(true)} className="px-8 py-3.5 bg-biolum-emerald/10 text-biolum-emerald border border-biolum-emerald/30 hover:bg-biolum-emerald/20 font-black tracking-widest uppercase text-xs rounded-2xl transition-all duration-300">
                Expand All
              </button>
              <button onClick={() => setExpandAll(false)} className="px-8 py-3.5 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-black tracking-widest uppercase text-xs rounded-2xl transition-all duration-300">
                Collapse All
              </button>
            </div>

            <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-biolum-teal/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="flex items-center mb-8 relative z-10">
                <TreePine className="w-8 h-8 text-biolum-teal mr-3" />
                <h2 className="text-3xl font-black tracking-tighter text-white">Taxonomic Tree</h2>
              </div>

              {taxonomyData.map((root, index) => (
                <TaxonomyNode key={`${index}-${expandAll}`} node={root} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Taxonomy;
