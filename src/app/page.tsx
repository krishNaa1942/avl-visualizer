import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Visualizer from "@/components/Visualizer";
import Documentation from "@/components/Documentation";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#020817]">
      <Navbar />
      <Hero />

      {/* Section divider */}
      <hr className="section-divider" />

      <Visualizer />

      {/* Section divider */}
      <hr className="section-divider" />

      {/* Documentation section */}
      <section id="docs" className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <Documentation />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm text-slate-500">
            Built as a DSA Project — Self-Balancing BST (AVL Tree) Visualization
          </p>
          <p className="mt-1 text-xs text-slate-600">
            AVL Trees invented by Adelson-Velski & Landis, 1962 · O(log n) guaranteed
          </p>
        </div>
      </footer>
    </main>
  );
}
