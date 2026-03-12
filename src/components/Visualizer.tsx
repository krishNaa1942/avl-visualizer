"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AVLNode,
  InsertStep,
  RotationType,
  avlInsert,
  avlDelete,
  cloneTree,
  resetNodeIdCounter,
} from "@/lib/avl";
import TreeVisualizer from "@/components/TreeVisualizer";
import RotationPanel from "@/components/RotationPanel";
import StepControls from "@/components/StepControls";
import TreeStats from "@/components/TreeStats";
import { Plus, Trash2, Shuffle, ChevronDown, Minus } from "lucide-react";

const PRESET_SEQUENCES = {
  "LL Case": [30, 20, 10],
  "RR Case": [10, 20, 30],
  "LR Case": [30, 10, 20],
  "RL Case": [10, 30, 20],
  "Balanced Tree": [25, 15, 35, 10, 20, 30, 40],
  "Complex": [10, 20, 30, 40, 50, 25, 5, 15, 45, 35],
};

export default function Visualizer() {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [steps, setSteps] = useState<InsertStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [activeRotation, setActiveRotation] = useState<RotationType>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update displayed step
  useEffect(() => {
    if (steps.length === 0) return;
    const step = steps[currentStep];
    setActiveRotation(step.rotationType);
    setHighlightedNodes(step.highlightedNodes);
    // Show the tree state at this step
    if (step.root !== null || step.phase === "insert") {
      // We display root from the last "done" step or the current step's snapshot
    }
  }, [currentStep, steps]);

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, steps.length]);

  const handleInsert = useCallback(
    (val: number) => {
      if (isNaN(val)) {
        setError("Please enter a valid number");
        return;
      }
      if (val < 0 || val > 9999) {
        setError("Value must be between 0 and 9999");
        return;
      }
      setError("");
      setIsPlaying(false);

      const { newRoot, steps: newSteps } = avlInsert(root, val);
      setRoot(newRoot);
      setSteps(newSteps);
      setCurrentStep(0);
      setHistory((h) => [...h, val]);
    },
    [root]
  );

  const handleInputInsert = () => {
    const val = parseInt(inputValue.trim());
    handleInsert(val);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleInputInsert();
  };

  const handleReset = () => {
    setRoot(null);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setHistory([]);
    setActiveRotation(null);
    setHighlightedNodes([]);
    setError("");
    resetNodeIdCounter();
  };

  const handleRandomInsert = () => {
    const val = Math.floor(Math.random() * 99) + 1;
    handleInsert(val);
  };

  const handleDelete = useCallback(
    (val: number) => {
      if (isNaN(val)) {
        setError("Please enter a valid number to delete");
        return;
      }
      if (!root) {
        setError("Tree is empty — nothing to delete");
        return;
      }
      setError("");
      setIsPlaying(false);

      const { newRoot, steps: newSteps, found } = avlDelete(root, val);
      if (!found) {
        setError(`Value ${val} not found in the tree`);
        return;
      }
      setRoot(newRoot);
      setSteps(newSteps);
      setCurrentStep(0);
      setHistory((h) => h.filter((v) => v !== val));
    },
    [root]
  );

  const handleDeleteInput = () => {
    handleDelete(parseInt(deleteValue.trim()));
    setDeleteValue("");
  };

  const handleDeleteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleDeleteInput();
  };

  const handlePreset = (sequence: number[]) => {
    handleReset();
    // Insert one by one after a small delay for UX
    let currentRootRef: AVLNode | null = null;
    let historyRef: number[] = [];
    resetNodeIdCounter();

    for (const val of sequence) {
      const { newRoot, steps: newSteps } = avlInsert(currentRootRef, val);
      currentRootRef = newRoot;
      historyRef = [...historyRef, val];
    }

    setRoot(currentRootRef);
    setHistory(historyRef);
    setSteps([]);
    setCurrentStep(0);
    setActiveRotation(null);
    setHighlightedNodes([]);
    setShowPresets(false);
  };

  // Determine current tree state to display
  const displayRoot = steps.length > 0 ? steps[currentStep]?.root ?? root : root;

  return (
    <section id="visualizer" className="min-h-screen py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-violet-400">
            Interactive Visualizer
          </span>
          <h2 className="text-4xl font-black text-white md:text-5xl">
            AVL Tree{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Visualizer
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Insert values and watch the AVL tree self-balance in real time with step-by-step rotation explanations.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 space-y-3"
        >
          {/* Insert row */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="relative flex items-center">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Insert value (0-9999)"
                className="h-12 w-52 rounded-xl border border-white/20 bg-white/5 px-4 text-white placeholder-slate-500 backdrop-blur-sm outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <button
              onClick={handleInputInsert}
              className="flex h-12 items-center gap-2 rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-600 to-blue-600 px-6 font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-95"
            >
              <Plus size={18} />
              Insert
            </button>

            <button
              onClick={handleRandomInsert}
              className="flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <Shuffle size={16} />
              Random
            </button>

            {/* Presets dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
              >
                Presets
                <ChevronDown size={14} className={`transition-transform ${showPresets ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showPresets && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-white/10 bg-slate-800/95 p-2 backdrop-blur-xl shadow-xl z-20"
                  >
                    {Object.entries(PRESET_SEQUENCES).map(([name, seq]) => (
                      <button
                        key={name}
                        onClick={() => handlePreset(seq)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition-colors hover:bg-white/10"
                      >
                        <span className="font-medium">{name}</span>
                        <span className="ml-2 text-xs text-slate-500">[{seq.join(",")}]</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleReset}
              className="flex h-12 items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-red-400 transition-all hover:bg-red-500/20"
            >
              <Trash2 size={16} />
              Reset
            </button>
          </div>

          {/* Delete row */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="relative flex items-center">
              <input
                type="number"
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                onKeyDown={handleDeleteKeyDown}
                placeholder="Delete value"
                className="h-11 w-44 rounded-xl border border-red-500/20 bg-red-500/5 px-4 text-white placeholder-slate-500 backdrop-blur-sm outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              />
            </div>
            <button
              onClick={handleDeleteInput}
              disabled={!root}
              className="flex h-11 items-center gap-2 rounded-xl border border-red-500/40 bg-gradient-to-r from-red-600 to-rose-600 px-5 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/40 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={16} />
              Delete Node
            </button>
            <p className="text-xs text-slate-500">← Enter a value and click to remove it from the tree</p>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 text-center text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {/* Tree - takes 3 cols */}
          <div className="lg:col-span-3 space-y-5">
            <TreeVisualizer
              root={displayRoot}
              highlightedNodes={highlightedNodes}
              width={900}
              height={500}
            />
            <StepControls
              steps={steps}
              currentStep={currentStep}
              isPlaying={isPlaying}
              onStepChange={setCurrentStep}
              onPlayPause={() => setIsPlaying((p) => !p)}
              onReset={() => setCurrentStep(0)}
            />
            <TreeStats root={root} history={history} />
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            <RotationPanel rotationType={activeRotation} />

            {/* Complexity reminder */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                AVL Complexity
              </p>
              {[
                { op: "Insert", val: "O(log n)" },
                { op: "Search", val: "O(log n)" },
                { op: "Delete", val: "O(log n)" },
                { op: "Height", val: "O(log n)" },
              ].map(({ op, val }) => (
                <div key={op} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-400">{op}</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">{val}</span>
                </div>
              ))}
            </div>

            {/* Quick tip */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">💡 Tip</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Try the presets to instantly see all 4 rotation types. Use the step controls 
                to replay each rotation frame by frame!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
