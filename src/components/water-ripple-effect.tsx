
'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  animationDelay: string; // e.g., "0s", "0.15s", "0.3s"
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
        animationDelay: '0s',
      },
      {
        id: baseId + 1, // Ensure unique IDs
        x: event.clientX,
        y: event.clientY,
        animationDelay: '0.15s', // Second wave starts slightly later
      },
      {
        id: baseId + 2, // Ensure unique IDs
        x: event.clientX,
        y: event.clientY,
        animationDelay: '0.3s', // Third wave starts even later
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
            animationDelay: ripple.animationDelay,
          }}
          onAnimationEnd={() => handleAnimationEnd(ripple.id)} 
        />
      ))}
    </>
  );
};

export default WaterRippleEffect;
