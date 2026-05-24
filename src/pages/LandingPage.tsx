import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Brain, Globe, Fish, Dna, BarChart3, Sparkles } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-24 pb-32 px-6 z-10"
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-500/30 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 font-semibold text-sm">AI-Powered Marine Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
              Neural <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Ocean</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
              AI-Driven Unified Marine Knowledge Graph Platform
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Integrating oceanography, fisheries, biodiversity, and eDNA into a unified AI-driven knowledge graph 
              for predicting fisheries stock, biodiversity risk detection, and policy simulations.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 flex items-center space-x-2 transform hover:scale-105"
            >
              <span className="relative z-10">Explore Platform</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="group bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:scale-105"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </motion.section>

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