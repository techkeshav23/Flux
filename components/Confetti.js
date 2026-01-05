'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export default function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (trigger) {
      // Create confetti pieces
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 6,
      }));
      setPieces(newPieces);

      // Clear after animation
      const timer = setTimeout(() => {
        setPieces([]);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
}
