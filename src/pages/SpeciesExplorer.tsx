import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicNavigation from '../components/layout/PublicNavigation';
import { Fish, Search, X, ExternalLink, Heart, MapPin, Ruler, Info } from 'lucide-react';

interface Species {
  id: number;
  name: string;
  scientificName: string;
  category: string;
  habitat: string;
  conservation: string;
  conservationColor: string;
  size: string;
  description: string;
  funFact: string;
  emoji: string;
}

const speciesData: Species[] = [
  {
    id: 1, name: 'Bluefin Tuna', scientificName: 'Thunnus thynnus', category: 'Fish',
    habitat: 'Atlantic Ocean, Mediterranean Sea', conservation: 'Endangered', conservationColor: 'red',
    size: 'Up to 3m (10ft)', description: 'One of the largest and fastest fish in the ocean, capable of speeds over 40 mph.',
    funFact: 'A single bluefin tuna sold for $3.1 million at a Tokyo fish auction in 2019.', emoji: '🐟'
  },
  {
    id: 2, name: 'Great White Shark', scientificName: 'Carcharodon carcharias', category: 'Sharks',
    habitat: 'Worldwide temperate oceans', conservation: 'Vulnerable', conservationColor: 'orange',
    size: 'Up to 6m (20ft)', description: 'The largest predatory fish on Earth, with up to 300 serrated teeth.',
    funFact: 'Great whites can detect one drop of blood in 25 gallons of water.', emoji: '🦈'
  },
  {
    id: 3, name: 'Blue Whale', scientificName: 'Balaenoptera musculus', category: 'Mammals',
    habitat: 'All major oceans', conservation: 'Endangered', conservationColor: 'red',
    size: 'Up to 30m (100ft)', description: 'The largest animal ever known to have existed on Earth.',
    funFact: 'A blue whale\'s heart is the size of a small car and beats only 8-10 times per minute.', emoji: '🐋'
  },
  {
    id: 4, name: 'Clownfish', scientificName: 'Amphiprioninae', category: 'Fish',
    habitat: 'Indian and Pacific Oceans', conservation: 'Least Concern', conservationColor: 'green',
    size: 'Up to 11cm (4.3in)', description: 'Famous for their symbiotic relationship with sea anemones.',
    funFact: 'All clownfish are born male — the dominant fish in a group becomes female.', emoji: '🐠'
  },
  {
    id: 5, name: 'Green Sea Turtle', scientificName: 'Chelonia mydas', category: 'Reptiles',
    habitat: 'Tropical and subtropical oceans', conservation: 'Endangered', conservationColor: 'red',
    size: 'Up to 1.5m (5ft)', description: 'One of the largest sea turtles, named for the green color of its fat.',
    funFact: 'Green sea turtles can hold their breath for up to 5 hours while sleeping.', emoji: '🐢'
  },
  {
    id: 6, name: 'Bottlenose Dolphin', scientificName: 'Tursiops truncatus', category: 'Mammals',
    habitat: 'Worldwide warm waters', conservation: 'Least Concern', conservationColor: 'green',
    size: 'Up to 4m (13ft)', description: 'Highly intelligent marine mammals known for their social behavior.',
    funFact: 'Dolphins sleep with one eye open and half their brain awake to watch for predators.', emoji: '🐬'
  },
  {
    id: 7, name: 'Moon Jellyfish', scientificName: 'Aurelia aurita', category: 'Invertebrates',
    habitat: 'All oceans worldwide', conservation: 'Least Concern', conservationColor: 'green',
    size: 'Up to 40cm (16in)', description: 'One of the most recognizable jellyfish with translucent bell-shaped body.',
    funFact: 'Jellyfish have been around for over 500 million years — older than dinosaurs.', emoji: '🪼'
  },
  {
    id: 8, name: 'Manta Ray', scientificName: 'Mobula birostris', category: 'Rays',
    habitat: 'Tropical and subtropical oceans', conservation: 'Vulnerable', conservationColor: 'orange',
    size: 'Up to 7m (23ft) wingspan', description: 'The largest ray species with the biggest brain-to-body ratio of any fish.',
    funFact: 'Manta rays can recognize themselves in mirrors, suggesting self-awareness.', emoji: '🐙'
  },
  {
    id: 9, name: 'Seahorse', scientificName: 'Hippocampus', category: 'Fish',
    habitat: 'Shallow tropical waters', conservation: 'Vulnerable', conservationColor: 'orange',
    size: 'Up to 35cm (14in)', description: 'Unique fish where the male carries and gives birth to the young.',
    funFact: 'Seahorses mate for life and greet each other every morning with a special dance.', emoji: '🦑'
  },
  {
    id: 10, name: 'Atlantic Cod', scientificName: 'Gadus morhua', category: 'Fish',
    habitat: 'North Atlantic Ocean', conservation: 'Vulnerable', conservationColor: 'orange',
    size: 'Up to 1.5m (5ft)', description: 'A historically important commercial fish species crucial for North Atlantic fisheries.',
    funFact: 'Cod can change color to blend in with their surroundings.', emoji: '🐟'
  },
  {
    id: 11, name: 'Brain Coral', scientificName: 'Diploria labyrinthiformis', category: 'Corals',
    habitat: 'Caribbean Sea, Atlantic Ocean', conservation: 'Near Threatened', conservationColor: 'yellow',
    size: 'Up to 1.8m (6ft)', description: 'Named for its resemblance to a human brain, these massive reef-builders can live for centuries.',
    funFact: 'Brain coral can live for over 900 years, making them one of the longest-lived organisms.', emoji: '🪸'
  },
  {
    id: 12, name: 'Giant Pacific Octopus', scientificName: 'Enteroctopus dofleini', category: 'Invertebrates',
    habitat: 'North Pacific Ocean', conservation: 'Least Concern', conservationColor: 'green',
    size: 'Up to 5m (16ft) arm span', description: 'The largest octopus species with remarkable intelligence and camouflage abilities.',
    funFact: 'An octopus has three hearts, blue blood, and can squeeze through any opening larger than its beak.', emoji: '🐙'
  },
];

const categories = ['All', 'Fish', 'Sharks', 'Mammals', 'Reptiles', 'Invertebrates', 'Rays', 'Corals'];

function SpeciesExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const filteredSpecies = speciesData.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <PublicNavigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            Marine <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Species</span> Explorer
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the incredible diversity of marine life across our planet's oceans
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search species by name..."
              className="w-full bg-black/60 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-black/60 text-gray-400 hover:text-white hover:bg-white dark:bg-black/80 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Species Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSpecies.map((species, i) => (
            <motion.div
              key={species.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => setSelectedSpecies(species)}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all duration-500 group"
            >
              {/* Emoji Header */}
              <div className="h-36 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                {species.emoji}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{species.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    species.conservationColor === 'red' ? 'bg-red-500/20 text-red-400' :
                    species.conservationColor === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                    species.conservationColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {species.conservation}
                  </span>
                </div>
                <p className="text-sm text-cyan-400/80 italic mb-3">{species.scientificName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{species.habitat}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSpecies.length === 0 && (
          <div className="text-center py-20">
            <Fish className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No species found matching your search</p>
          </div>
        )}
      </div>

      {/* Species Detail Modal */}
      <AnimatePresence>
        {selectedSpecies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedSpecies(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="h-48 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 flex items-center justify-center text-8xl relative">
                {selectedSpecies.emoji}
                <button
                  onClick={() => setSelectedSpecies(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-white dark:bg-black/80 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="text-3xl font-black text-white">{selectedSpecies.name}</h2>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                    selectedSpecies.conservationColor === 'red' ? 'bg-red-500/20 text-red-400' :
                    selectedSpecies.conservationColor === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                    selectedSpecies.conservationColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedSpecies.conservation}
                  </span>
                </div>
                <p className="text-cyan-400 italic mb-6">{selectedSpecies.scientificName}</p>

                <p className="text-gray-300 leading-relaxed mb-6">{selectedSpecies.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-400">Habitat:</span>
                    <span className="text-white font-medium">{selectedSpecies.habitat}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Ruler className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white font-medium">{selectedSpecies.size}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Fish className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white font-medium">{selectedSpecies.category}</span>
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-cyan-400">Fun Fact</span>
                  </div>
                  <p className="text-gray-300 text-sm">{selectedSpecies.funFact}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SpeciesExplorer;
