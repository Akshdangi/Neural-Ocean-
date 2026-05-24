import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/assets/coral.png',
    title: 'Coral Reef Ecosystems',
    subtitle: 'AI-driven identification of over 10,000 coral and tropical fish species with 99% accuracy.'
  },
  {
    id: 2,
    image: '/assets/turtle.png',
    title: 'Endangered Species Tracking',
    subtitle: 'Monitor migration patterns and health indicators of vulnerable marine life.'
  },
  {
    id: 3,
    image: '/assets/jellyfish.png',
    title: 'Deep Sea Bioluminescence',
    subtitle: 'Discover and classify unknown abyssal species using advanced neural networks.'
  }
];

export default function SpeciesHeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-[3rem] overflow-hidden mb-8 border border-white/10 shadow-[0_0_40px_rgba(13,148,136,0.2)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={slides[current].image} 
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="inline-block px-3 py-1 bg-teal-500/20 border border-teal-500/50 rounded-full text-[10px] font-black tracking-widest uppercase text-teal-400 mb-3">
              Neural Network Active
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">
              {slides[current].title}
            </h2>
            <p className="text-gray-300 font-medium max-w-2xl">
              {slides[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${current === idx ? 'w-8 bg-teal-400' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
