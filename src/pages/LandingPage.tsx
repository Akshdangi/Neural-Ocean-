import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Brain, Globe, Fish, Dna, BarChart3, Sparkles } from 'lucide-react';
import HeroSlider from '../components/ui/HeroSlider';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] overflow-hidden selection:bg-biolum-teal/30 selection:text-biolum-teal">
      {/* Advanced Sci-Fi Logo Header */}
      <div className="absolute top-0 left-0 w-full z-50 p-8 flex justify-between items-start pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative group pointer-events-auto cursor-default"
        >
          {/* Background scanline effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-biolum-teal/0 via-biolum-teal/10 to-transparent skew-x-[-30deg] translate-x-[-100%] group-hover:animate-[shimmer_3s_infinite] blur-md" />
          
          <div className="flex items-center gap-6 relative z-10">
            {/* Highly advanced animated icon container */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-biolum-teal/20 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
              <div className="absolute inset-0 border border-biolum-emerald/30 rounded-full animate-ping opacity-20 duration-[3000ms]" />
              <div className="absolute inset-2 border border-blue-500/40 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
              <div className="w-10 h-10 bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] rounded-lg flex items-center justify-center z-10 border border-biolum-teal/40 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                <Database className="w-6 h-6 text-biolum-teal drop-shadow-[0_0_10px_rgba(6,182,212,1)] group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

            {/* Typography with complex tracking and glowing gradients */}
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl font-black tracking-[0.25em] uppercase leading-none">
                <span className="bg-gradient-to-r from-white via-biolum-teal to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                  NEURAL
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-biolum-emerald to-white bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] ml-4">
                  OCEAN
                </span>
              </h1>
              
              {/* Technical readout underneath */}
              <div className="flex items-center gap-4 mt-3 ml-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-red-400 uppercase">A.I. Core Active</span>
                </div>
                <div className="h-px w-12 bg-white dark:bg-black/80" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">Node: Alpha_01</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Optional decorative corner UI */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="hidden md:flex flex-col items-end gap-1 pointer-events-auto"
        >
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`w-1 h-3 rounded-full ${i <= 3 ? 'bg-biolum-teal shadow-[0_0_5px_rgba(6,182,212,0.8)] animate-pulse' : 'bg-black/60'}`} style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
          <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase mt-2">Network Status</span>
        </motion.div>
      </div>

      {/* Hero Section with Slider */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <HeroSlider />
        
        {/* Main CTA overlay at the bottom of hero */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">


          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 px-6 w-full max-w-2xl"
          >
            <button
              onClick={() => navigate('/explore')}
              className="flex-1 group relative overflow-hidden bg-biolum-teal hover:bg-cyan-400 text-obsidian-900 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] flex items-center justify-center space-x-2"
            >
              <Globe className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Explore Ocean</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex-1 group bg-black/50 backdrop-blur-xl hover:bg-black/60 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center space-x-2"
            >
              <span>Researcher Login</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-white mb-6">
              Powerful Capabilities
            </h2>
            <p className="text-xl text-gray-400">Everything you need to understand and protect our oceans</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Fish className="w-8 h-8" />,
                title: "Fisheries Analytics",
                description: "AI-powered stock prediction and sustainable fishing insights",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Dna className="w-8 h-8" />,
                title: "eDNA Analysis",
                description: "Environmental DNA processing for biodiversity monitoring",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "3D Ocean Mapping",
                description: "Interactive visualization of oceanographic layers",
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI Knowledge Graph",
                description: "Unified data integration with machine learning insights",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "Data Management",
                description: "Comprehensive dataset upload, processing, and analysis",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Policy Simulation",
                description: "Evidence-based policy modeling and impact assessment",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:from-white/20 hover:to-white/10 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-cyan-500/10">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <div className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-xl w-fit mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{feature.description}</p>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-16 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-8">Our Mission</h2>
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                Neural Ocean represents the next generation of marine science platforms, combining cutting-edge AI 
                with comprehensive oceanic data to create actionable insights for researchers, policy makers, and 
                conservationists. By unifying disparate data sources into a single, intelligent knowledge graph, 
                we're empowering evidence-based decision making for the future of our oceans.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;