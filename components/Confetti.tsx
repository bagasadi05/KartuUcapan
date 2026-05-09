import React from 'react';

interface ConfettiProps {
  style: React.CSSProperties;
  size: number;
}

const Confetti: React.FC<ConfettiProps> = ({ style, size }) => {
  const colors = [
    'text-amber-300',
    'text-yellow-200',
    'text-sky-300',
    'text-emerald-300'
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
        <path d="M12 2 14.7 8.8 22 12l-7.3 3.2L12 22l-2.7-6.8L2 12l7.3-3.2L12 2Z" />
      </svg>
    </div>
  );
};

export default Confetti;
