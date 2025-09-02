import React, { useMemo } from 'react';

const ITEM_COUNT = 25; 
const MESSAGES = [
    "Hai, Uswa...",
    "Di galaksi yang luas ini...",
    "Senyummu adalah bintang paling terang.",
    "Tawamu adalah melodi terindah.",
    "Setiap detik bersamamu...",
    "...adalah anugerah.",
    "Terima kasih sudah ada.",
    "Kamu luar biasa ♥"
];

const HEART_COLORS = [
    'text-red-500', 
    'text-pink-400', 
    'text-rose-400', 
    'text-fuchsia-500'
];

const EndlessLove: React.FC = () => {
    const items = useMemo(() => {
        const positions = [];
        const GRID_COLS = 5;
        const GRID_ROWS = 5;
        const cellWidth = 100 / GRID_COLS;
        const cellHeight = 100 / GRID_ROWS;

        for (let i = 0; i < ITEM_COUNT; i++) {
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
        
        return Array.from({ length: ITEM_COUNT }).map((_, i) => {
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
                    <div key={`text-${i}`} className="fly-in-element text-white text-lg sm:text-xl md:text-3xl font-bold tracking-widest neon-text whitespace-nowrap" style={style}>
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
            } else if (itemType > 0.2) { // 40% chance for heart
                const heartColor = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
                return (
                    <div key={`heart-${i}`} className={`fly-in-heart-element ${heartColor}`} style={{...style, fontSize: `${Math.random() * 20 + 20}px`}}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[1em] h-[1em]" viewBox="0 0 24 24" fill="currentColor"
                             style={{ filter: 'drop-shadow(0 0 5px #f00) drop-shadow(0 0 15px #f00)' }}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                );
            } else { // 20% chance for stardust
                const size = Math.random() * 10 + 5;
                return (
                    <div key={`stardust-${i}`} className="fly-in-heart-element" style={{ ...style }}>
                       <div className="rounded-full bg-white" style={{
                           width: `${size}px`,
                           height: `${size}px`,
                           filter: 'blur(3px) brightness(1.5)',
                           boxShadow: '0 0 8px 2px #fff, 0 0 12px 4px #f0abfc, 0 0 20px 6px #a855f7',
                           opacity: Math.random() * 0.5 + 0.5,
                       }}></div>
                    </div>
                );
            }
        });
    }, []);

    // The Climax Message - now dynamic and part of the 3D scene
    const climaxMessage = (
        <div 
            className="fly-in-climax-element"
            style={{
                top: '50%',
                left: '50%',
                animationDuration: '50s',
                animationDelay: '5s', 
            }}
        >
            <div className="text-white text-3xl sm:text-4xl md:text-6xl font-dancing tracking-wider neon-text animate-pulse-glow whitespace-nowrap">
                Kaulah semestaku, Uswa.
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

export default React.memo(EndlessLove);