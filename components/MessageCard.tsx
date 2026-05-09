import React, { useMemo } from 'react';

const ITEM_COUNT = 16;
const MOBILE_ITEM_COUNT = 8;
const MESSAGES = [
    "Chapter 23",
    "10 Mei 2026",
    "Maya Amanda",
    "semoga sehat selalu",
    "semoga langkahmu tenang",
    "banyak kabar baik",
    "hari yang indah",
    "keep glowing"
];

const CONFETTI_COLORS = [
    'text-amber-300',
    'text-yellow-200',
    'text-sky-300',
    'text-emerald-300'
];

const BirthdayMessages: React.FC = () => {
    const items = useMemo(() => {
        const itemCount = window.matchMedia('(max-width: 640px)').matches ? MOBILE_ITEM_COUNT : ITEM_COUNT;
        const positions = [];
        const GRID_COLS = 5;
        const GRID_ROWS = 5;
        const cellWidth = 100 / GRID_COLS;
        const cellHeight = 100 / GRID_ROWS;

        for (let i = 0; i < itemCount; i++) {
            const col = i % GRID_COLS;
            const row = Math.floor(i / GRID_COLS);
            positions.push({
                left: col * cellWidth + Math.random() * cellWidth,
                top: row * cellHeight + Math.random() * cellHeight,
            });
        }

        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        return Array.from({ length: itemCount }).map((_, i) => {
            const position = positions[i];
            const itemType = Math.random();
            const style: React.CSSProperties = {
                top: `${position.top}%`,
                left: `${position.left}%`,
                animationDuration: `${Math.random() * 10 + 10}s`, // 10s to 20s
                animationDelay: `${Math.random() * 19 + 1}s`, // 1s to 20s delay
                transformOrigin: 'center'
            };

            if (itemType > 0.6) { // 40% chance for text
                const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
                style.transform = `rotateY(${Math.random() * 20 - 10}deg)`;

                return (
                    <div key={`text-${i}`} className="fly-in-element text-white text-sm sm:text-lg md:text-2xl font-bold tracking-widest neon-text whitespace-nowrap" style={style}>
                        <span
                            className="shimmering-text"
                            style={{
                                display: 'inline-block',
                                animationDuration: `${Math.random() * 4 + 3}s`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        >
                             {randomMessage}
                        </span>
                    </div>
                );
            } else if (itemType > 0.2) { // 40% chance for sparkle
                const confettiColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
                return (
                    <div key={`sparkle-${i}`} className={`fly-in-sparkle-element ${confettiColor}`} style={{...style, fontSize: `${Math.random() * 20 + 20}px`}}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[1em] h-[1em]" viewBox="0 0 24 24" fill="currentColor"
                             style={{ filter: 'drop-shadow(0 0 4px #facc15)' }}>
                            <path d="M12 2 14.7 8.8 22 12l-7.3 3.2L12 22l-2.7-6.8L2 12l7.3-3.2L12 2Z" />
                        </svg>
                    </div>
                );
            } else { // 20% chance for stardust
                const size = Math.random() * 10 + 5;
                return (
                    <div key={`stardust-${i}`} className="fly-in-sparkle-element" style={{ ...style }}>
                       <div className="rounded-full bg-white" style={{
                           width: `${size}px`,
                           height: `${size}px`,
                           filter: 'blur(2px) brightness(1.35)',
                           boxShadow: '0 0 8px 2px #fff, 0 0 14px 4px #a855f7',
                           opacity: Math.random() * 0.5 + 0.5,
                       }}></div>
                    </div>
                );
            }
        });
    }, []);

    const climaxMessage = (
        <div 
            className="fly-in-climax-element"
            style={{
                top: '50%',
                left: '50%',
                animationDuration: '50s',
                animationDelay: '7s', 
            }}
        >
            <div className="text-white text-2xl sm:text-4xl md:text-6xl font-dancing tracking-wider neon-text animate-pulse-glow whitespace-nowrap">
                Happy 23rd, Maya Amanda.
            </div>
        </div>
    );

    return (
        <>
            {items}
            {climaxMessage}
        </>
    );
};

export default React.memo(BirthdayMessages);
