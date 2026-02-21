'use client';

import { motion } from 'framer-motion';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/[0.04] blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] right-[-10%] w-[35%] h-[35%] rounded-full bg-purple-500/[0.04] blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-teal-500/[0.03] blur-[100px]"
      />
    </div>
  );
}
