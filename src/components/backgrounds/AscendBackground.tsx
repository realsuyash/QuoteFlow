
"use client";

import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  id: number;
  style: React.CSSProperties;
  icon: string; // Using text emojis for simplicity
  colorClass: string;
}

const motivationalIcons = ['🎯', '🏆', '🌟', '🚀', '💡', '✨'];
const iconColors = [
  'text-yellow-400', // For 🌟 and 🏆
  'text-red-500',    // For 🎯
  'text-blue-400',   // For 🚀
  'text-purple-400', // For ✨
  'text-green-400',  // For 💡
];

interface AscendBackgroundProps {
  isActive?: boolean;
  elementCount?: number;
}

const AscendBackground: React.FC<AscendBackgroundProps> = ({ isActive = false, elementCount = 20 }) => {
  const [animatedIcons, setAnimatedIcons] = useState<AnimatedIconProps[]>([]);

  useEffect(() => {
    if (isActive) {
      const newIcons: AnimatedIconProps[] = [];
      for (let i = 0; i < elementCount; i++) {
        const delay = Math.random() * 1.2;
        const duration = 2.5 + Math.random() * 1.5;
        const startX = 45 + Math.random() * 10;
        const startY = 90 + Math.random() * 10; // Start from bottom
        const finalViewportX = Math.random() * 100;
        const finalViewportY = Math.random() * 50 - 30; // Target mid to top, some off-screen
        const transformX_vw = finalViewportX - startX;
        const transformY_vh = finalViewportY - startY;
        const selectedIcon = motivationalIcons[Math.floor(Math.random() * motivationalIcons.length)];
        const colorClass = iconColors[Math.floor(Math.random() * iconColors.length)];
        const initialRotation = Math.random() * 90 - 45; // Less initial rotation
        const targetRotation = initialRotation + (Math.random() * 180 - 90); // Less overall rotation

        newIcons.push({
          id: Date.now() + i,
          icon: selectedIcon,
          colorClass,
          style: {
            left: `${startX}vw`,
            top: `${startY}vh`,
            opacity: 0,
            fontSize: `${1.8 + Math.random() * 1.2}rem`, // Icon size
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            '--tx': `${transformX_vw}vw`,
            '--ty': `${transformY_vh}vh`,
            '--initial-scale': '0.25',
            '--target-scale': `${1 + Math.random() * 0.4}`,
            '--initial-rotate': `${initialRotation}deg`,
            '--target-rotate': `${targetRotation}deg`,
          } as React.CSSProperties,
        });
      }
      setAnimatedIcons(newIcons.sort(() => Math.random() - 0.5));
    } else {
      setAnimatedIcons([]);
    }
  }, [isActive, elementCount]);

  return (
    <div className="absolute inset-0 w-full h-full ascend-bg -z-10 overflow-hidden">
      {isActive && animatedIcons.map((el) => (
        <span
          key={el.id}
          style={el.style}
          className={cn("absolute animate-elementThrow pointer-events-none", el.colorClass)}
          aria-hidden="true"
        >
          {el.icon}
        </span>
      ))}
    </div>
  );
};

export default AscendBackground;
