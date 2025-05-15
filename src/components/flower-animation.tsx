
'use client';

import { useEffect, useState } from 'react';

const flowerColors = [
  'text-pink-400',
  'text-red-400',
  'text-yellow-400',
  'text-purple-400',
  'text-blue-400',
  'text-green-400',
  'text-indigo-400',
];

interface FlowerInstanceProps {
  id: number;
  style: React.CSSProperties;
  colorClass: string;
}

const Flower: React.FC<FlowerInstanceProps> = ({ style, colorClass }) => {
  return (
    <svg
      style={style}
      className={`absolute w-8 h-8 md:w-10 md:h-10 ${colorClass} animate-flowerThrow`}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M10 1.6c-2.37 0-4.44 1.28-5.5 3.17-.24.42-.07.95.36 1.18.43.24.96.06 1.18-.36C6.73 4.98 8.27 4.1 10 4.1c1.73 0 3.27.88 3.96 2.49.22.42.75.6 1.18.36.43-.24.6-.75.36-1.18C14.44 2.88 12.37 1.6 10 1.6zM3.17 5.5C1.28 6.56.01 8.63.01 11c0 2.37 1.28 4.44 3.17 5.5.42.24.95.07 1.18-.36.24-.43.06-.96-.36-1.18C2.98 14.27 2.1 12.73 2.1 11c0-1.73.88-3.27 2.49-3.96.42-.22.6-.75.36-1.18-.23-.43-.76-.6-1.18-.36zm13.66 0c-.42-.24-.95-.07-1.18.36-.24.43-.06.96.36 1.18C17.02 7.73 17.9 9.27 17.9 11c0 1.73-.88 3.27-2.49 3.96-.42.22-.6.75-.36 1.18.23.43.76.6 1.18.36C18.72 15.44 20 13.37 20 11c0-2.37-1.28-4.44-3.17-5.5zM10 18.4c2.37 0 4.44-1.28 5.5-3.17.24-.42.07-.95-.36-1.18-.43-.24-.96-.06-1.18.36C13.27 15.02 11.73 15.9 10 15.9c-1.73 0-3.27-.88-3.96-2.49-.22-.42-.75-.6-1.18-.36-.43-.24-.6.75-.36 1.18C5.56 17.12 7.63 18.4 10 18.4z" />
      <circle cx="10" cy="11" r="3" />
    </svg>
  );
};

interface FlowerAnimationProps {
  isActive: boolean;
  count?: number;
}

const FlowerAnimation: React.FC<FlowerAnimationProps> = ({ isActive, count = 30 }) => {
  const [flowers, setFlowers] = useState<FlowerInstanceProps[]>([]);

  useEffect(() => {
    if (isActive) {
      const newFlowers: FlowerInstanceProps[] = [];
      for (let i = 0; i < count; i++) {
        const delay = Math.random() * 1.5; // Max 1.5s delay
        const duration = 2.5 + Math.random() * 1.5; // 2.5s to 4s duration

        // Start from bottom-center, slightly spread
        const startX = 45 + Math.random() * 10; // vw (center area)
        const startY = 95 + Math.random() * 10; // vh (bottom of screen)

        // Target a random position across the screen
        const finalViewportX = Math.random() * 100; // vw
        const finalViewportY = Math.random() * 80; // vh (mostly upper part of screen)

        // Calculate transform delta for animation (target - start)
        const transformX_vw = finalViewportX - startX;
        const transformY_vh = finalViewportY - startY;
        
        const colorClass = flowerColors[Math.floor(Math.random() * flowerColors.length)];

        newFlowers.push({
          id: Date.now() + i, // Unique key
          style: {
            left: `${startX}vw`,
            top: `${startY}vh`,
            opacity: 0, // Start transparent, animation handles fade-in
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            '--tx': `${transformX_vw}vw`,
            '--ty': `${transformY_vh}vh`,
          } as React.CSSProperties,
          colorClass,
        });
      }
      setFlowers(newFlowers);
    } else {
      // Clear flowers when not active to allow re-triggering.
      // The 'forwards' fill-mode means elements stay at their animation end-state (opacity: 0),
      // but removing them from DOM is cleaner.
      setFlowers([]);
    }
  }, [isActive, count]);

  if (!isActive && flowers.length === 0) { // Also check flowers.length to avoid flicker if isActive becomes false while flowers are fading
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
      {flowers.map((flower) => (
        <Flower key={flower.id} style={flower.style} colorClass={flower.colorClass} />
      ))}
    </div>
  );
};

export default FlowerAnimation;
