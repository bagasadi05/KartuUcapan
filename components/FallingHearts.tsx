
import React from 'react';
import Heart from './Heart';

const HEART_COUNT = 50;

const FallingHearts: React.FC = () => {
  const hearts = Array.from({ length: HEART_COUNT }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 8 + 7}s`, // 7s to 15s
      animationDelay: `${Math.random() * 15}s`,
      '--tx-start': `${(Math.random() - 0.5) * 20}vw`,
      '--tx-end': `${(Math.random() - 0.5) * 40}vw`,
      '--rotate-end': `${(Math.random() - 0.5) * 720}deg`,
    } as React.CSSProperties;
    const size = Math.random() * 20 + 10; // 10px to 30px
    return <Heart key={i} style={style} size={size} />;
  });

  return <div className="absolute inset-0 z-0">{hearts}</div>;
};

export default FallingHearts;