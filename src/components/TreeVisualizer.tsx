"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AVLNode, assignPositions } from "@/lib/avl";

interface TreeVisualizerProps {
  root: AVLNode | null;
  highlightedNodes: number[];
  width?: number;
  height?: number;
}

const NODE_RADIUS = 28;

function getNodeColor(bf: number, isNew: boolean, isHighlighted: boolean): string {
  if (isHighlighted) return "#f59e0b"; // amber
  if (isNew) return "#10b981"; // emerald
  if (Math.abs(bf) > 1) return "#ef4444"; // red - imbalanced
  if (Math.abs(bf) === 1) return "#6366f1"; // indigo - slightly unbalanced
  return "#3b82f6"; // blue - balanced
}

function getBorderColor(bf: number): string {
  if (Math.abs(bf) > 1) return "#ef4444";
  if (Math.abs(bf) === 1) return "#818cf8";
  return "#60a5fa";
}

interface NodePos {
  node: AVLNode;
  x: number;
  y: number;
}

function collectNodes(node: AVLNode | null, list: NodePos[]) {
  if (!node) return;
  list.push({ node, x: node.x ?? 0, y: node.y ?? 0 });
  collectNodes(node.left, list);
  collectNodes(node.right, list);
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
}

function collectEdges(node: AVLNode | null, edges: Edge[]) {
  if (!node) return;
  if (node.left) {
    edges.push({
      x1: node.x ?? 0,
      y1: node.y ?? 0,
      x2: node.left.x ?? 0,
      y2: node.left.y ?? 0,
      id: `${node.id}-${node.left.id}`,
    });
    collectEdges(node.left, edges);
  }
  if (node.right) {
    edges.push({
      x1: node.x ?? 0,
      y1: node.y ?? 0,
      x2: node.right.x ?? 0,
      y2: node.right.y ?? 0,
      id: `${node.id}-${node.right.id}`,
    });
    collectEdges(node.right, edges);
  }
}

export default function TreeVisualizer({
  root,
  highlightedNodes,
  width = 900,
  height = 500,
}: TreeVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Assign positions before rendering
  const rootClone = root;
  if (rootClone) {
    assignPositions(rootClone, width / 2, 60, width / 4);
  }

  const nodes: NodePos[] = [];
  const edges: Edge[] = [];
  collectNodes(rootClone, nodes);
  collectEdges(rootClone, edges);

  if (!root) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5"
        style={{ width, height }}
      >
        <div className="text-center text-slate-400">
          <div className="mb-2 text-5xl">🌳</div>
          <p className="text-lg font-medium">Insert a value to start</p>
          <p className="mt-1 text-sm">Your AVL tree will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-auto rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80"
      style={{ width: "100%", minHeight: height }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height }}
        className="select-none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge) => (
          <motion.line
            key={edge.id}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="rgba(148,163,184,0.4)"
            strokeWidth={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        ))}

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map(({ node, x, y }) => {
            const isHighlighted = highlightedNodes.includes(node.id);
            const fillColor = getNodeColor(node.balanceFactor, !!node.isNew, isHighlighted);
            const borderColor = getBorderColor(node.balanceFactor);

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ originX: x, originY: y }}
              >
                {/* Glow ring for highlighted */}
                {isHighlighted && (
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_RADIUS + 6}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    opacity={0.5}
                    filter="url(#glow)"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_RADIUS}
                  fill={fillColor}
                  stroke={borderColor}
                  strokeWidth={2}
                  filter="url(#shadow)"
                  fillOpacity={0.9}
                />

                {/* Node value */}
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={14}
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {node.data}
                </text>

                {/* Balance Factor label */}
                <text
                  x={x + NODE_RADIUS + 4}
                  y={y - NODE_RADIUS + 2}
                  fill={Math.abs(node.balanceFactor) > 1 ? "#ef4444" : "#94a3b8"}
                  fontSize={10}
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {node.balanceFactor >= 0 ? "+" : ""}
                  {node.balanceFactor}
                </text>

                {/* Height label */}
                <text
                  x={x}
                  y={y + NODE_RADIUS + 12}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={9}
                  fontFamily="monospace"
                >
                  h={node.height}
                </text>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 p-3 backdrop-blur-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Legend</p>
        {[
          { color: "#3b82f6", label: "Balanced (BF=0)" },
          { color: "#6366f1", label: "Slightly off (|BF|=1)" },
          { color: "#ef4444", label: "Imbalanced (|BF|>1)" },
          { color: "#10b981", label: "Newly inserted" },
          { color: "#f59e0b", label: "Rotation pivot" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-slate-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
