import React from 'react';

const STAR_COUNT = 10;

const ShootingStars: React.FC = () => {
  const stars = Array.from({ length: STAR_COUNT }).map((_, i) => {
    const angle = Math.random() * 45 + 10; // 10 to 55 degrees
    const startTop = Math.random() * 100 - 50; // -50% to 50%
    const startLeft = Math.random() * 100 - 50; // -50% to 50%
    const duration = Math.random() * 2 + 1; // 1s to 3s
    const delay = Math.random() * 10; // 0s to 10s
    
    // Calculate end position based on a long trajectory
    const endX = Math.cos((angle * Math.PI) / 180) * 200;
    const endY = Math.sin((angle * Math.PI) / 180) * 200;

    // FIX: Changed type annotation to a type assertion (`as`) to allow for CSS custom properties.
    const style = {
      top: `${startTop}%`,
      left: `${startLeft}%`,
      transform: `rotate(${angle}deg)`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      '--end-x': `${endX}vw`,
      '--end-y': `${endY}vh`,
    } as React.CSSProperties;

    return <div key={i} className="shooting-star" style={style} />;
  });

  return <div className="absolute inset-0 z-0 overflow-hidden">{stars}</div>;
};

export default ShootingStars;
