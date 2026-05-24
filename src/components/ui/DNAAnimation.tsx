import { motion } from 'framer-motion';

export default function DNAAnimation() {
  const dots = Array.from({ length: 15 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div className="absolute top-0 right-10 md:right-1/4 h-full flex flex-col justify-around">
        {dots.map((_, i) => (
          <div key={`dna-${i}`} className="w-64 h-16 relative flex items-center justify-between">
            {/* Strand 1 */}
            <motion.div
              animate={{
                x: [0, 60, 0, -60, 0],
                scale: [1, 1.5, 1, 0.5, 1],
                zIndex: [10, 20, 10, 0, 10],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              className="absolute left-1/2 w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
            />
            {/* Strand 2 */}
            <motion.div
              animate={{
                x: [0, -60, 0, 60, 0],
                scale: [1, 0.5, 1, 1.5, 1],
                zIndex: [10, 0, 10, 20, 10],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              className="absolute left-1/2 w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]"
            />
            {/* Connector */}
            <motion.div
              animate={{
                width: ['0px', '120px', '0px', '120px', '0px'],
                opacity: [0, 0.5, 0, 0.5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              className="absolute left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-teal-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
