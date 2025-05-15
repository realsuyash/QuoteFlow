
"use client";

import React from 'react';

const CloudyBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-400 -z-10"> {/* Base color for clouds area */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>
      <div className="cloud cloud4"></div>
      <div className="cloud cloud5"></div>
    </div>
  );
};

export default CloudyBackground;
