"use client";

import React from "react";
import { motion } from "framer-motion";
import { InsertStep } from "@/lib/avl";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface StepControlsProps {
  steps: InsertStep[];
  currentStep: number;
  isPlaying: boolean;
  onStepChange: (step: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

const phaseColors: Record<string, string> = {
  insert: "text-blue-400",
  update: "text-indigo-400",
  rotate: "text-amber-400",
  done: "text-emerald-400",
  delete: "text-red-400",
  successor: "text-purple-400",
};

const phaseIcons: Record<string, string> = {
  insert: "📥",
  update: "📊",
  rotate: "🔄",
  done: "✅",
  delete: "🗑️",
  successor: "🔍",
};

export default function StepControls({
  steps,
  currentStep,
  isPlaying,
  onStepChange,
  onPlayPause,
  onReset,
}: StepControlsProps) {
  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      {/* Step description */}
      <div className="mb-4 min-h-[64px] rounded-xl bg-black/20 p-4">
        {step ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-base">{phaseIcons[step.phase]}</span>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${phaseColors[step.phase]}`}
              >
                {step.phase}
              </span>
              <span className="ml-auto text-xs text-slate-500">
                Step {currentStep + 1}/{totalSteps}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{step.description}</p>
          </motion.div>
        ) : (
          <p className="text-sm text-slate-500">Insert values to see step-by-step explanation</p>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onStepChange(0)}
          disabled={currentStep === 0 || totalSteps === 0}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="First step"
        >
          <SkipBack size={14} />
        </button>

        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || totalSteps === 0}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Previous step"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={onPlayPause}
          disabled={totalSteps === 0}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/40 bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-30"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep === totalSteps - 1 || totalSteps === 0}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Next step"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => onStepChange(totalSteps - 1)}
          disabled={currentStep === totalSteps - 1 || totalSteps === 0}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Last step"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Step markers */}
      {totalSteps > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => onStepChange(i)}
              className={`h-2 flex-1 min-w-[8px] max-w-[20px] rounded-full transition-all ${
                i === currentStep
                  ? "bg-violet-500"
                  : i < currentStep
                  ? "bg-slate-500"
                  : "bg-white/10"
              }`}
              title={`Step ${i + 1}: ${s.phase}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
