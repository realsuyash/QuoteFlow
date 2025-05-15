
"use client";

import React from 'react';

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 18" // Adjusted viewBox for a common heart shape
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 16.35C3.85-1.31 0 2.84 0 6.59c0 3.09 2.78 5.74 5.26 7.85C7.74 16.6 10 18.55 10 18.55s2.26-1.95 4.74-4.28c2.48-2.11 5.26-4.76 5.26-7.85c0-3.75-3.85-7.9-10-2.24z" />
  </svg>
);


const SunriseBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full sunrise-bg -z-10 overflow-hidden">
      {/* Heart Animations */}
      <HeartIcon className="love-heart love-heart-1" />
      <HeartIcon className="love-heart love-heart-2" />
      <HeartIcon className="love-heart love-heart-3" />
      <HeartIcon className="love-heart love-heart-4" />
      <HeartIcon className="love-heart love-heart-5" />
      <HeartIcon className="love-heart love-heart-6" />
    </div>
  );
};

export default SunriseBackground;
