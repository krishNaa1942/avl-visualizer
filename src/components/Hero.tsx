"use client";

import React from "react";
import { motion } from "framer-motion";
import { TreePine, Zap, BookOpen, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <Zap size={20} />,
    title: "Real-time Animation",
    desc: "Watch nodes insert, rotate, and balance with fluid animations",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: <TreePine size={20} />,
    title: "All 4 Rotations",
    desc: "LL, RR, LR, RL cases explained with step-by-step diagrams",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Balance Factors",
    desc: "Color-coded nodes show balance factor at every step",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: <BookOpen size={20} />,
    title: "Full Documentation",
    desc: "Written guide from BST complexity to AVL vs Red-Black Trees",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden flex items-center pt-16">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            DSA Project — Self-Balancing BST
          </motion.div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
            Visualize{" "}
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AVL Trees
            </span>
            <br />
            Like Never Before
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 leading-relaxed md:text-lg">
            An interactive, step-by-step visualization of AVL tree insertions and self-balancing rotations.
            Built with love for data structure enthusiasts.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="#visualizer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition-all hover:shadow-violet-500/50"
            >
              Launch Visualizer →
            </motion.a>
            <motion.a
              href="#docs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-bold text-slate-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
            >
              Read Documentation
            </motion.a>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            {[
              { value: "O(log n)", label: "All Operations" },
              { value: "4", label: "Rotation Types" },
              { value: "⌊1.44 log n⌋", label: "Max Height" },
              { value: "1962", label: "Invented" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white font-mono">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`rounded-2xl border p-5 transition-all hover:scale-[1.02] cursor-default ${f.bg}`}
            >
              <div className={`mb-3 w-fit rounded-xl p-2.5 ${f.bg} ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
