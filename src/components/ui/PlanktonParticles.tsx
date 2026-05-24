import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PlanktonParticles() {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, size: number, duration: number }[]>([]);

  useEffect(() => {
    // Generate 40 random particles
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100,
      size: Math.random() * 4 + 1, // 1 to 5px
      duration: Math.random() * 20 + 10, // 10 to 30s
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/40 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
