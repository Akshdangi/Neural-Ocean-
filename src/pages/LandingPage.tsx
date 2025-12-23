import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Brain, Globe, Fish, Dna, BarChart3 } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 pb-32 px-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Neural <span className="text-cyan-400">Ocean</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              AI-Driven Unified Marine Knowledge Graph Platform
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Integrating oceanography, fisheries, biodiversity, and eDNA into a unified AI-driven knowledge graph 
              for predicting fisheries stock, biodiversity risk detection, and policy simulations.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 flex items-center space-x-2"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white text-center mb-16"
          >
            Platform Capabilities
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="group relative"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all duration-300 h-full">
                  <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-lg w-fit mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Neural Ocean represents the next generation of marine science platforms, combining cutting-edge AI 
              with comprehensive oceanic data to create actionable insights for researchers, policy makers, and 
              conservationists. By unifying disparate data sources into a single, intelligent knowledge graph, 
              we're empowering evidence-based decision making for the future of our oceans.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;