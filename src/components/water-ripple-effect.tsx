
'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Define HSL colors based on the theme's primary color, with varying alpha
const rippleColors = [
  `hsla(var(--primary), 1)`,      // Full opacity primary
  `hsla(var(--primary), 0.7)`,   // 70% opacity primary
  `hsla(var(--primary), 0.4)`,   // 40% opacity primary
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

  const addRipple = useCallback((event: MouseEvent) => {
    const baseId = Date.now();
    const newRipples: Ripple[] = [
      {
        id: baseId,
        x: event.clientX,
        y: event.clientY,
        color: rippleColors[0],
        animationDelay: '0s',
      },
      {
        id: baseId + 1,
        x: event.clientX,
        y: event.clientY,
        color: rippleColors[1],
        animationDelay: '0.15s',
      },
      {
        id: baseId + 2,
        x: event.clientX,
        y: event.clientY,
        color: rippleColors[2],
        animationDelay: '0.3s',
      },
    ];

    setRipples(prevRipples => [...prevRipples, ...newRipples]);
  }, []);

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
