import React, { useMemo } from 'react';
import Confetti from './Confetti';

const CONFETTI_COUNT = 25;

const FallingConfetti: React.FC = () => {
  const confetti = useMemo(() => Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 8 + 7}s`, // 7s to 15s
      animationDelay: `${Math.random() * 15}s`,
      '--tx-start': `${(Math.random() - 0.5) * 20}vw`,
      '--tx-end': `${(Math.random() - 0.5) * 40}vw`,
      '--rotate-end': `${(Math.random() - 0.5) * 720}deg`,
    } as React.CSSProperties;
    const size = Math.random() * 20 + 10; // 10px to 30px
    return <Confetti key={i} style={style} size={size} />;
  }), []);

  return <div className="absolute inset-0 z-0">{confetti}</div>;
};

export default FallingConfetti;
