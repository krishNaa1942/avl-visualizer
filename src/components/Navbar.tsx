"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TreePine, Github, ExternalLink } from "lucide-react";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#visualizer", label: "Visualizer" },
  { href: "#docs", label: "Documentation" },
  { href: "#bst-complexity", label: "Complexity" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
            <TreePine size={18} className="text-white" />
          </div>
          <div>
            <span className="font-black text-white text-sm tracking-tight">AVL</span>
            <span className="font-bold text-violet-400 text-sm">Visualizer</span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-all hover:bg-white/5 hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <Github size={13} />
            GitHub
          </a>
          <a
            href="#visualizer"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40"
          >
            Try Now
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
