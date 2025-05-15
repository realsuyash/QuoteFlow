
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

const glitterColors = [
  'text-pink-300',
  'text-yellow-200',
  'text-sky-300', // Light blue
  'text-purple-300',
  'text-lime-300', // Light green
  'text-orange-300',
];

interface AnimatedElementProps {
  id: number;
  style: React.CSSProperties;
  colorClass: string;
  element: JSX.Element;
  viewBox: string;
  sizeClass: string;
}

const FlowerSvg = (
  <>
    <path d="M10 1.6c-2.37 0-4.44 1.28-5.5 3.17-.24.42-.07.95.36 1.18.43.24.96.06 1.18-.36C6.73 4.98 8.27 4.1 10 4.1c1.73 0 3.27.88 3.96 2.49.22.42.75.6 1.18.36.43-.24.6-.75.36-1.18C14.44 2.88 12.37 1.6 10 1.6zM3.17 5.5C1.28 6.56.01 8.63.01 11c0 2.37 1.28 4.44 3.17 5.5.42.24.95.07 1.18-.36.24-.43.06-.96-.36-1.18C2.98 14.27 2.1 12.73 2.1 11c0-1.73.88-3.27 2.49-3.96.42-.22.6-.75.36-1.18-.23-.43-.76-.6-1.18-.36zm13.66 0c-.42-.24-.95-.07-1.18.36-.24.43-.06.96.36 1.18C17.02 7.73 17.9 9.27 17.9 11c0 1.73-.88 3.27-2.49 3.96-.42.22-.6.75-.36 1.18.23.43.76.6 1.18.36C18.72 15.44 20 13.37 20 11c0-2.37-1.28-4.44-3.17-5.5zM10 18.4c2.37 0 4.44-1.28 5.5-3.17.24-.42.07-.95-.36-1.18-.43-.24-.96-.06-1.18.36C13.27 15.02 11.73 15.9 10 15.9c-1.73 0-3.27-.88-3.96-2.49-.22-.42-.75-.6-1.18-.36-.43-.24-.6.75-.36 1.18C5.56 17.12 7.63 18.4 10 18.4z" />
    <circle cx="10" cy="11" r="3" />
  </>
);

const GlitterSvg = <circle cx="10" cy="10" r="6" />; // A slightly larger radius to be more visible when scaled down

interface AnimationProps {
  isActive: boolean;
  flowerCount?: number;
  glitterCount?: number;
}

const FlowerAnimation: React.FC<AnimationProps> = ({
  isActive,
  flowerCount = 20, // Reduced flower count to make space for glitter
  glitterCount = 30, // Added glitter count
}) => {
  const [animatedElements, setAnimatedElements] = useState<AnimatedElementProps[]>([]);

  useEffect(() => {
    if (isActive) {
      const newElements: AnimatedElementProps[] = [];

      // Generate Flowers
      for (let i = 0; i < flowerCount; i++) {
        const delay = Math.random() * 1.5;
        const duration = 2.5 + Math.random() * 1.5;
        const startX = 45 + Math.random() * 10;
        const startY = 95 + Math.random() * 10;
        const finalViewportX = Math.random() * 100;
        const finalViewportY = Math.random() * 80;
        const transformX_vw = finalViewportX - startX;
        const transformY_vh = finalViewportY - startY;
        const colorClass = flowerColors[Math.floor(Math.random() * flowerColors.length)];

        newElements.push({
          id: Date.now() + i,
          element: FlowerSvg,
          viewBox: "0 0 20 20",
          sizeClass: "w-8 h-8 md:w-10 md:h-10",
          style: {
            left: `${startX}vw`,
            top: `${startY}vh`,
            opacity: 0,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            '--tx': `${transformX_vw}vw`,
            '--ty': `${transformY_vh}vh`,
            '--initial-scale': '0.2',
            '--target-scale': '1.3',
            '--initial-rotate': '0deg',
            '--target-rotate': '720deg',
          } as React.CSSProperties,
          colorClass,
        });
      }

      // Generate Glitter
      for (let i = 0; i < glitterCount; i++) {
        const delay = Math.random() * 1.8; // Slightly different delay spread for glitter
        const duration = 2.0 + Math.random() * 1.0; // Glitter can be a bit faster
        const startX = 48 + Math.random() * 4; // More centered start for glitter
        const startY = 90 + Math.random() * 15;
        const finalViewportX = Math.random() * 100;
        const finalViewportY = Math.random() * 85; // Can go a bit higher
        const transformX_vw = finalViewportX - startX;
        const transformY_vh = finalViewportY - startY;
        const colorClass = glitterColors[Math.floor(Math.random() * glitterColors.length)];

        newElements.push({
          id: Date.now() + flowerCount + i, // Ensure unique IDs
          element: GlitterSvg,
          viewBox: "0 0 20 20", // Use same viewBox, scale will make it appear small
          sizeClass: "w-5 h-5 md:w-6 md:h-6", // Slightly smaller base size for glitter containers
          style: {
            left: `${startX}vw`,
            top: `${startY}vh`,
            opacity: 0,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            '--tx': `${transformX_vw}vw`,
            '--ty': `${transformY_vh}vh`,
            '--initial-scale': '0.1', // Glitter starts smaller
            '--target-scale': `${0.4 + Math.random() * 0.3}`, // Glitter is smaller and has varied final size
            '--initial-rotate': '0deg',
            '--target-rotate': `${Math.random() * 360}deg`, // Random, less intense rotation for glitter
          } as React.CSSProperties,
          colorClass,
        });
      }
      
      setAnimatedElements(newElements.sort(() => Math.random() - 0.5)); // Shuffle elements for better layering
    } else {
      setAnimatedElements([]);
    }
  }, [isActive, flowerCount, glitterCount]);

  if (!isActive && animatedElements.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
      {animatedElements.map((el) => (
        <svg
          key={el.id}
          style={el.style}
          className={`absolute ${el.sizeClass} ${el.colorClass} animate-elementThrow`}
          viewBox={el.viewBox}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          {el.element}
        </svg>
      ))}
    </div>
  );
};

export default FlowerAnimation;
