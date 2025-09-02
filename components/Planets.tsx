import React, { useMemo } from 'react';

const PLANET_COUNT = 5;
const PLANET_TYPES = [
  { className: 'planet-1', sizeRange: [80, 150] }, // Gas Giant
  { className: 'planet-2', sizeRange: [50, 100] }, // Ringed Planet
  { className: 'planet-3', sizeRange: [20, 40] },  // Ice Planet
];

const Planets: React.FC = () => {
  const planets = useMemo(() => {
    return Array.from({ length: PLANET_COUNT }).map((_, i) => {
      const type = PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)];
      const size = Math.random() * (type.sizeRange[1] - type.sizeRange[0]) + type.sizeRange[0];
      
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 80 + 10}%`, // 10% to 90% vertical
        left: `${Math.random() * 80 + 10}%`, // 10% to 90% horizontal
        animationDuration: `${Math.random() * 40 + 60}s`, // 60s to 100s
        animationDelay: `-${Math.random() * 100}s`, // Start at a random point in the animation
        opacity: Math.random() * 0.4 + 0.3, // 0.3 to 0.7
      } as React.CSSProperties;

      return (
        <div key={i} className={`planet ${type.className}`} style={style} />
      );
    });
  }, []);

  return <div className="absolute inset-0 z-[-1] overflow-hidden">{planets}</div>;
};

export default Planets;