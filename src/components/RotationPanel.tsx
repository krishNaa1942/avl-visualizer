"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotationType } from "@/lib/avl";

interface RotationInfo {
  type: RotationType;
  description: string;
  diagram: string;
  rotations: string[];
  cause: string;
}

const ROTATION_INFO: Record<string, RotationInfo> = {
  LL: {
    type: "LL",
    description: "Left-Left Imbalance",
    cause: "Insertion in the LEFT subtree of the LEFT child",
    diagram: `
      z (+2)          y (0)
     / \\            / \\
    y   T4  →→→   x    z
   / \\           / \\  / \\
  x   T3        T1 T2 T3 T4
 / \\
T1   T2`,
    rotations: ["Single Right Rotation on z"],
  },
  RR: {
    type: "RR",
    description: "Right-Right Imbalance",
    cause: "Insertion in the RIGHT subtree of the RIGHT child",
    diagram: `
  z (-2)              y (0)
 / \\                /   \\
T1   y    →→→      z     x
    / \\           / \\ / \\
   T2   x        T1 T2 T3 T4
       / \\
      T3  T4`,
    rotations: ["Single Left Rotation on z"],
  },
  LR: {
    type: "LR",
    description: "Left-Right Imbalance",
    cause: "Insertion in the RIGHT subtree of the LEFT child",
    diagram: `
    z (+2)        z            x
   / \\          / \\          / \\
  y   T4  →   x   T4  →   y    z
 / \\         / \\          /\\  /\\
T1   x       y   T3      T1 T2 T3 T4
    / \\      / \\
   T2  T3   T1  T2`,
    rotations: ["Left Rotation on y", "Right Rotation on z"],
  },
  RL: {
    type: "RL",
    description: "Right-Left Imbalance",
    cause: "Insertion in the LEFT subtree of the RIGHT child",
    diagram: `
  z (-2)      z              x
 / \\        / \\            / \\
T1   y  →  T1   x    →   z    y
    / \\        / \\       /\\  /\\
   x   T4     T2  y    T1 T2 T3 T4
  / \\             /\\
 T2  T3          T3 T4`,
    rotations: ["Right Rotation on y", "Left Rotation on z"],
  },
};

interface RotationPanelProps {
  rotationType: RotationType;
}

const colorMap: Record<string, string> = {
  LL: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  RR: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  LR: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  RL: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
};

const badgeMap: Record<string, string> = {
  LL: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  RR: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  LR: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  RL: "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

export default function RotationPanel({ rotationType }: RotationPanelProps) {
  if (!rotationType) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-center text-slate-400">
          <div className="mb-2 text-3xl">⚖️</div>
          <p className="font-medium">No rotation needed</p>
          <p className="mt-1 text-sm">Rotations appear here when imbalance is detected</p>
        </div>
      </div>
    );
  }

  const info = ROTATION_INFO[rotationType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={rotationType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl border bg-gradient-to-br p-5 ${colorMap[rotationType]}`}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <span
              className={`inline-block rounded-lg border px-3 py-1 text-sm font-bold tracking-wider ${badgeMap[rotationType]}`}
            >
              {rotationType} CASE
            </span>
            <h3 className="mt-2 text-xl font-bold text-white">{info.description}</h3>
          </div>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl"
          >
            🔄
          </motion.div>
        </div>

        <p className="mb-4 text-sm text-slate-300">
          <span className="font-semibold text-white">Cause:</span> {info.cause}
        </p>

        <div className="mb-4 rounded-xl bg-black/30 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Rotation Diagram
          </p>
          <pre className="overflow-x-auto whitespace-pre text-xs text-slate-200 font-mono leading-5">
            {info.diagram}
          </pre>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Steps Performed
          </p>
          {info.rotations.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="mb-2 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm text-slate-200">{r}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
