
'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Define VIBGYOR base HSL values
// H (Hue): Violet (270), Indigo (240-250), Blue (210-240), Green (120), Yellow (60), Orange (30), Red (0)
// S (Saturation): Kept relatively high for vibrancy
// L (Lightness): Kept around 50-60% for good visibility
const vibgyorBaseHSL = [
  { h: 270, s: 70, l: 60 }, // Violet
  { h: 245, s: 70, l: 60 }, // Indigo
  { h: 220, s: 80, l: 55 }, // Blue
  { h: 120, s: 70, l: 45 }, // Green
  { h: 60, s: 90, l: 55 },  // Yellow
  { h: 30, s: 90, l: 55 },  // Orange
  { h: 0, s: 80, l: 55 },   // Red
];

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
  animationDelay: string;
}

const WaterRippleEffect: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [clickColorIndex, setClickColorIndex] = useState(0);

  const addRipple = useCallback((event: MouseEvent) => {
    const baseId = Date.now();
    const currentBaseColorHSL = vibgyorBaseHSL[clickColorIndex];

    const dynamicRippleColors = [
      `hsla(${currentBaseColorHSL.h}, ${currentBaseColorHSL.s}%, ${currentBaseColorHSL.l}%, 1)`,      // Full opacity
      `hsla(${currentBaseColorHSL.h}, ${currentBaseColorHSL.s}%, ${currentBaseColorHSL.l}%, 0.7)`,   // 70% opacity
      `hsla(${currentBaseColorHSL.h}, ${currentBaseColorHSL.s}%, ${currentBaseColorHSL.l}%, 0.4)`,   // 40% opacity
    ];

    const newRipples: Ripple[] = [
      {
        id: baseId,
        x: event.clientX,
        y: event.clientY,
        color: dynamicRippleColors[0],
        animationDelay: '0s',
      },
      {
        id: baseId + 1,
        x: event.clientX,
        y: event.clientY,
        color: dynamicRippleColors[1],
        animationDelay: '0.15s',
      },
      {
        id: baseId + 2,
        x: event.clientX,
        y: event.clientY,
        color: dynamicRippleColors[2],
        animationDelay: '0.3s',
      },
    ];

    setRipples(prevRipples => [...prevRipples, ...newRipples]);
    setClickColorIndex(prevIndex => (prevIndex + 1) % vibgyorBaseHSL.length);
  }, [clickColorIndex]);

  useEffect(() => {
    document.addEventListener('click', addRipple);
    
    return () => {
      document.removeEventListener('click', addRipple);
    };
  }, [addRipple]);

  const handleAnimationEnd = (id: number) => {
    setRipples(prevRipples => prevRipples.filter(ripple => ripple.id !== id));
  };

  return (
    <>
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple" 
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            borderColor: ripple.color,
            animationDelay: ripple.animationDelay,
          }}
          onAnimationEnd={() => handleAnimationEnd(ripple.id)} 
        />
      ))}
    </>
  );
};

export default WaterRippleEffect;
