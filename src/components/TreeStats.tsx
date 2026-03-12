"use client";

import React from "react";
import { motion } from "framer-motion";
import { AVLNode, preorder, inorder, postorder, countNodes } from "@/lib/avl";

interface TreeStatsProps {
  root: AVLNode | null;
  history: number[];
}

export default function TreeStats({ root, history }: TreeStatsProps) {
  const height = root ? root.height : 0;
  const count = countNodes(root);
  const pre  = preorder(root);
  const ino  = inorder(root);
  const post = postorder(root);

  // Height of worst unbalanced BST for same count
  const worstBSTHeight = count > 0 ? count : 0;
  const heightSaved = worstBSTHeight - height;

  const stats = [
    { label: "Nodes", value: count, icon: "🌐" },
    { label: "Height", value: height, icon: "📏" },
    { label: "BST Worst", value: worstBSTHeight, icon: "📈" },
    { label: "Height Saved", value: heightSaved, icon: "💡" },
  ];

  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
          >
            <div className="text-xl">{stat.icon}</div>
            <div className="mt-1 text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Traversals */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
            Preorder (Root→L→R)
          </p>
          <p className="font-mono text-sm text-slate-200 break-all">
            {pre.length > 0 ? pre.join(" → ") : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Inorder (L→Root→R)
          </p>
          <p className="font-mono text-sm text-slate-200 break-all">
            {ino.length > 0 ? ino.join(" → ") : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            Postorder (L→R→Root)
          </p>
          <p className="font-mono text-sm text-slate-200 break-all">
            {post.length > 0 ? post.join(" → ") : "—"}
          </p>
        </div>
      </div>

      {/* Insertion history */}
      {history.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Insertion History
          </p>
          <div className="flex flex-wrap gap-2">
            {history.map((val, i) => (
              <motion.span
                key={`${val}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 font-mono text-xs font-bold text-violet-300 border border-violet-500/30"
              >
                {val}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
