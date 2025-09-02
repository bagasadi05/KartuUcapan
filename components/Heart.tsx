
import React from 'react';

interface HeartProps {
  style: React.CSSProperties;
  size: number;
}

const Heart: React.FC<HeartProps> = ({ style, size }) => {
  const colors = [
    'text-pink-400',
    'text-red-400',
    'text-purple-400',
    'text-rose-300'
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8

  return (
    <div
      className={`absolute top-[-10vh] animate-fall ${color}`}
      style={{ ...style, opacity }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

export default Heart;
