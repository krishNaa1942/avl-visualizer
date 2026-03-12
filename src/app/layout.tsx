import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVL Tree Visualizer — Self-Balancing BST",
  description:
    "Interactive AVL tree visualization with step-by-step insertion, rotation animations (LL, RR, LR, RL), balance factor display, and comprehensive documentation on balanced binary search trees.",
  keywords: [
    "AVL tree",
    "self-balancing BST",
    "binary search tree",
    "data structures",
    "algorithm visualization",
    "tree rotations",
    "DSA",
  ],
  openGraph: {
    title: "AVL Tree Visualizer",
    description: "Interactive step-by-step AVL tree insertion and balancing visualizer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
