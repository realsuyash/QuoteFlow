
'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const WaterRippleEffect: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((event: MouseEvent) => {
    setRipples(prevRipples => [
      ...prevRipples,
      {
        id: Date.now(), // Using Date.now() for a simple unique ID
        x: event.clientX,
        y: event.clientY,
      },
    ]);
  }, []);

  useEffect(() => {
    // Add event listener to the document
    document.addEventListener('click', addRipple);
    
    // Cleanup: remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', addRipple);
    };
  }, [addRipple]); // Re-run effect if addRipple changes (it won't in this case due to useCallback with empty deps)

  const handleAnimationEnd = (id: number) => {
    setRipples(prevRipples => prevRipples.filter(ripple => ripple.id !== id));
  };

  return (
    <>
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple" // CSS class for styling and animation
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
          }}
          onAnimationEnd={() => handleAnimationEnd(ripple.id)} // Remove ripple after animation
        />
      ))}
    </>
  );
};

export default WaterRippleEffect;
