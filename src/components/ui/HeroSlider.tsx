import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/images/slide1.png',
    title: 'Discover the Deep',
    subtitle: 'Unlocking the mysteries of bioluminescent ecosystems with AI.',
  },
  {
    id: 2,
    image: '/images/slide2.png',
    title: 'Preserve Coral Reefs',
    subtitle: 'Real-time biodiversity monitoring for fragile habitats.',
  },
  {
    id: 3,
    image: '/images/slide3.png',
    title: 'Advanced Research',
    subtitle: 'Empowering global oceanographic missions with intelligent insights.',
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)]">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          
          {/* Gradients to blend slider into the dark theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-900/80 via-obsidian-900/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating UI Elements over Slider */}
      <div className="absolute inset-0 flex flex-col justify-end pb-32 px-6 max-w-7xl mx-auto z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-biolum-teal text-sm font-bold mb-4 tracking-wider uppercase">
              Featured Insight
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl text-gray-300 font-light">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex gap-3 mt-8 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentSlide === idx ? 'w-8 bg-biolum-teal' : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
