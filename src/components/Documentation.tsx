"use client";

import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "bst-complexity",
    icon: "⏱️",
    title: "BST Time Complexity",
    color: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300",
    content: (
      <div>
        <p className="mb-4 text-slate-300 text-sm leading-relaxed">
          A Binary Search Tree (BST) maintains the invariant that for each node <code className="bg-white/10 px-1 rounded text-blue-300">n</code>: all left 
          descendants are smaller, and all right descendants are larger.
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-left text-slate-400 font-semibold">Operation</th>
                <th className="p-3 text-center text-slate-400 font-semibold">Average Case</th>
                <th className="p-3 text-center text-slate-400 font-semibold">Worst Case</th>
                <th className="p-3 text-left text-slate-400 font-semibold">Condition</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Search", "O(log n)", "O(n)", "Skewed tree"],
                ["Insert", "O(log n)", "O(n)", "Sorted insertion"],
                ["Delete", "O(log n)", "O(n)", "Skewed tree"],
                ["Min/Max", "O(log n)", "O(n)", "Skewed tree"],
                ["Height", "O(log n)", "O(n)", "Unbalanced"],
              ].map(([op, avg, worst, cond]) => (
                <tr key={op} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono text-white font-semibold">{op}</td>
                  <td className="p-3 text-center text-emerald-400 font-mono font-bold">{avg}</td>
                  <td className="p-3 text-center text-red-400 font-mono font-bold">{worst}</td>
                  <td className="p-3 text-slate-400 text-xs">{cond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="text-sm text-amber-200">
            ⚠️ <strong>The Problem:</strong> Inserting sorted data (1, 2, 3, 4, 5...) into a BST creates a 
            linear chain — height O(n), destroying the log advantage.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "why-balanced",
    icon: "⚖️",
    title: "Why Balanced BST?",
    color: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
    badge: "bg-purple-500/20 text-purple-300",
    content: (
      <div className="space-y-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          In a balanced BST, height is maintained at <span className="font-mono text-purple-300 font-bold">O(log n)</span>, 
          guaranteeing logarithmic performance for all operations regardless of insertion order.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Unbalanced BST", icon: "❌", items: ["Height O(n)", "Search O(n)", "Degrades to linked list", "Unpredictable perf"] },
            { title: "Balanced BST", icon: "✅", items: ["Height O(log n)", "All ops O(log n)", "Predictable performance", "Handles sorted input"] },
          ].map(({ title, icon, items }) => (
            <div key={title} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <h4 className="text-sm font-bold text-white mb-3">{icon} {title}</h4>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="mt-0.5 text-slate-500">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Real-world applications — databases (B-trees), file systems, priority queues — require 
          guaranteed O(log n) to handle millions of operations efficiently.
        </p>
      </div>
    ),
  },
  {
    id: "avl-intro",
    icon: "🌳",
    title: "AVL Trees: Detecting Imbalance",
    color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300",
    content: (
      <div className="space-y-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Invented by <span className="text-emerald-300 font-semibold">Adelson-Velski & Landis (1962)</span>, 
          AVL trees are the first class of self-balancing BSTs. They maintain balance using the 
          <span className="font-mono text-emerald-300 font-semibold"> Balance Factor (BF)</span> at each node.
        </p>
        
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">Balance Factor Formula</p>
          <p className="font-mono text-lg text-center text-white font-bold">
            BF(node) = height(left) − height(right)
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { bf: "BF = -1, 0, +1", label: "Balanced ✅", color: "text-emerald-400" },
            { bf: "BF = +2", label: "Left Heavy ⚠️", color: "text-amber-400" },
            { bf: "BF = -2", label: "Right Heavy ⚠️", color: "text-red-400" },
          ].map(({ bf, label, color }) => (
            <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className={`font-mono text-sm font-bold ${color}`}>{bf}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          After every insertion or deletion, AVL trees <strong className="text-white">traverse back up</strong> the 
          path and re-check BF at each node. If |BF| exceeds 1, the appropriate rotation is applied.
        </p>
      </div>
    ),
  },
  {
    id: "four-cases",
    icon: "🔄",
    title: "Four Types of Imbalance",
    color: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300",
    content: (
      <div className="space-y-3">
        {[
          {
            case: "LL",
            full: "Left-Left",
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
            trigger: "Inserted in left subtree of left child",
            fix: "Single Right Rotation on unbalanced node",
          },
          {
            case: "RR",
            full: "Right-Right",
            color: "text-purple-400",
            bg: "bg-purple-500/10 border-purple-500/20",
            trigger: "Inserted in right subtree of right child",
            fix: "Single Left Rotation on unbalanced node",
          },
          {
            case: "LR",
            full: "Left-Right",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
            trigger: "Inserted in right subtree of left child",
            fix: "Left Rotate on left child → Right Rotate on root",
          },
          {
            case: "RL",
            full: "Right-Left",
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
            trigger: "Inserted in left subtree of right child",
            fix: "Right Rotate on right child → Left Rotate on root",
          },
        ].map(({ case: c, full, color, bg, trigger, fix }) => (
          <div key={c} className={`rounded-xl border p-3 ${bg}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`font-mono text-sm font-black ${color}`}>{c}</span>
              <span className="text-sm font-semibold text-white">{full} Case</span>
            </div>
            <p className="text-xs text-slate-400"><span className="text-slate-300 font-medium">Trigger:</span> {trigger}</p>
            <p className="text-xs text-slate-400 mt-1"><span className="text-slate-300 font-medium">Fix:</span> {fix}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "avl-vs-rbt",
    icon: "⚔️",
    title: "AVL vs Red-Black Trees",
    color: "from-rose-500/10 to-rose-600/5 border-rose-500/20",
    badge: "bg-rose-500/20 text-rose-300",
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-left text-slate-400 font-semibold">Property</th>
                <th className="p-3 text-center text-blue-400 font-semibold">AVL Tree</th>
                <th className="p-3 text-center text-red-400 font-semibold">Red-Black Tree</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Height guarantee", "⌊1.44 log n⌋", "2 log(n+1)"],
                ["Balance strictness", "Strict (|BF|≤1)", "Relaxed (2-coloring)"],
                ["Search speed", "⚡ Faster", "Slightly slower"],
                ["Insert/Delete", "More rotations", "At most 3 rotations"],
                ["Memory", "Height per node", "Color bit per node"],
                ["Best for", "Read-heavy workloads", "Write-heavy workloads"],
                ["Used in", "Databases, filesystems", "Linux kernel, Java TreeMap"],
              ].map(([prop, avl, rbt]) => (
                <tr key={prop} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-slate-300 font-medium">{prop}</td>
                  <td className="p-3 text-center text-blue-300 font-mono">{avl}</td>
                  <td className="p-3 text-center text-red-300 font-mono">{rbt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs">
            <p className="font-bold text-blue-300 mb-1">Use AVL When:</p>
            <p className="text-slate-300">Reads far outnumber writes. Databases, lookup tables, in-memory indexes. Maximum search speed matters.</p>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs">
            <p className="font-bold text-red-300 mb-1">Use Red-Black When:</p>
            <p className="text-slate-300">Frequent insertions and deletions. OS schedulers, std::map, TreeMap. Write performance is a priority.</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Documentation() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">AVL Tree Documentation</h2>
        <p className="text-slate-400 text-sm">Comprehensive guide to self-balancing binary search trees</p>
      </div>

      {sections.map((section, i) => (
        <motion.div
          key={section.id}
          id={section.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className={`rounded-2xl border bg-gradient-to-br p-6 ${section.color}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="text-2xl">{section.icon}</span>
            <h3 className="text-xl font-bold text-white">{section.title}</h3>
            <span className={`ml-auto rounded-lg px-2 py-0.5 text-xs font-bold ${section.badge}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          {section.content}
        </motion.div>
      ))}
    </div>
  );
}
