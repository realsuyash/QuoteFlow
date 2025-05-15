
"use client";

import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedEmojiProps {
  id: number;
  style: React.CSSProperties;
  emoji: string;
  colorClass: string;
}

const emojis = ['🎉', '😂', '🤪', '🥳', '🤩', '🤯', '🎊'];
const emojiColors = [
  'text-yellow-400',
  'text-pink-500',
  'text-sky-400',
  'text-lime-400',
  'text-orange-500',
  'text-purple-500',
];

interface FunnyBackgroundProps {
  isActive?: boolean;
  elementCount?: number;
}

const FunnyBackground: React.FC<FunnyBackgroundProps> = ({ isActive = false, elementCount = 25 }) => {
  const [animatedEmojis, setAnimatedEmojis] = useState<AnimatedEmojiProps[]>([]);

  useEffect(() => {
    if (isActive) {
      const newEmojis: AnimatedEmojiProps[] = [];
      for (let i = 0; i < elementCount; i++) {
        const delay = Math.random() * 1; // Faster start
        const duration = 2 + Math.random() * 1.5;
        const startX = 45 + Math.random() * 10;
        const startY = 85 + Math.random() * 10; // Start a bit higher
        const finalViewportX = Math.random() * 100;
        const finalViewportY = Math.random() * 40 - 20; // Target higher, some off-screen top
        const transformX_vw = finalViewportX - startX;
        const transformY_vh = finalViewportY - startY;
        const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const colorClass = emojiColors[Math.floor(Math.random() * emojiColors.length)];
        const initialRotation = Math.random() * 360;
        const targetRotation = initialRotation + (Math.random() * 720 - 360); // Random rotation

        newEmojis.push({
          id: Date.now() + i,
          emoji: selectedEmoji,
          colorClass,
          style: {
            left: `${startX}vw`,
            top: `${startY}vh`,
            opacity: 0,
            fontSize: `${2 + Math.random() * 1.5}rem`, // Slightly larger base emojis
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            '--tx': `${transformX_vw}vw`,
            '--ty': `${transformY_vh}vh`,
            '--initial-scale': '0.3',
            '--target-scale': `${1 + Math.random() * 0.5}`,
            '--initial-rotate': `${initialRotation}deg`,
            '--target-rotate': `${targetRotation}deg`,
          } as React.CSSProperties,
        });
      }
      setAnimatedEmojis(newEmojis.sort(() => Math.random() - 0.5));
    } else {
      setAnimatedEmojis([]);
    }
  }, [isActive, elementCount]);

  return (
    <div className={cn("absolute inset-0 w-full h-full -z-10 bg-yellow-300 overflow-hidden")}>
      {isActive && animatedEmojis.map((el) => (
        <span
          key={el.id}
          style={el.style}
          className={cn("absolute animate-elementThrow pointer-events-none", el.colorClass)}
          aria-hidden="true"
        >
          {el.emoji}
        </span>
      ))}
    </div>
  );
};

export default FunnyBackground;
