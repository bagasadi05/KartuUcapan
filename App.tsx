
import React, { useState, useRef } from 'react';
import EndlessLove from './components/MessageCard';

const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const PlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

type IntroState = 'visible' | 'hidden';

const App: React.FC = () => {
  const [introState, setIntroState] = useState<IntroState>('visible');
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const handleOpenMessage = () => {
    if (introState !== 'visible') return;

    setIntroState('hidden');
    
    if (audioRef.current) {
        const audio = audioRef.current;
        audio.volume = 0;
        audio.play().catch(error => console.error("Audio autoplay failed:", error));
        
        let vol = 0;
        const fadeAudioIn = setInterval(() => {
            if (vol < 1) {
                vol = Math.min(1, vol + 0.1);
                audio.volume = vol;
            } else {
                clearInterval(fadeAudioIn);
            }
        }, 150);
    }
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (introState !== 'hidden' || !mainRef.current) return;
    
    const { clientX, clientY } = e;
    const { offsetWidth, offsetHeight } = mainRef.current;
    const x = (clientX / offsetWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / offsetHeight - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const perspectiveStyle: React.CSSProperties = {
    transform: `rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg)`,
  };


  return (
    <main 
        ref={mainRef}
        onMouseMove={handleMouseMove}
        className="relative w-screen h-screen overflow-hidden bg-[#02010a] flex items-center justify-center antialiased star-bg"
    >
      {/* Intro Screen Wrapper */}
      <div className={`absolute inset-0 z-10 flex items-center justify-center text-center p-4 transition-opacity duration-[1500ms] ease-in-out ${introState === 'visible' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-200 tracking-wider drop-shadow-[0_1px_5px_rgba(255,255,255,0.5)] mb-2">
                Di antara milyaran bintang...
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 drop-shadow-[0_1px_5px_rgba(255,255,255,0.5)] mb-8">
                ...ada satu yang paling spesial.
              </p>
            <button
              onClick={handleOpenMessage}
              className="bg-pink-500/30 text-pink-200 p-6 rounded-full backdrop-blur-sm border border-pink-400/50 hover:bg-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-pulse-heart"
              aria-label="Buka Pesan"
              disabled={introState !== 'visible'}
            >
              <HeartIcon />
            </button>
          </div>
      </div>
      
      {/* Galaxy Screen Wrapper */}
      <div className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${introState === 'hidden' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
            className="absolute inset-0 perspective-container overflow-hidden"
            style={perspectiveStyle}
          >
            <EndlessLove />
        </div>
        <button
          onClick={togglePlayPause}
          className="fixed bottom-5 right-5 z-20 bg-pink-500/30 text-pink-200 p-4 rounded-full backdrop-blur-sm border border-pink-400/50 hover:bg-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.6)] hover:shadow-[0_0_25px_rgba(244,114,182,0.8)] transition-all duration-300"
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <audio ref={audioRef} src="https://dl191.filemate21.shop/?file=M3R4SUNiN3JsOHJ6WWQ2a3NQS1Y5ZHZrY2xXNXMvb2wxZEFzd2dJNkZhTkZxSXBpd3FtaE1jd0JJN2RjaTR5ckhkdHI1VC9NZVkzT1lpbVF1WTB5VjNHRXNvUWJ0QytjdHR3R1c0d2pjRUM5eWNDdnRHbFh1aExsVU16QkF2WmJmU1E5cEVWc2pnKzNpdlRNcVJ6cXRtbWtxa2plUFhOZjVHTmFhYXlHcHRsYjNIUE9NcVM4Z2NWUStuTFo4WXdVM3ZLaXBnVG16N3M5dVE9PQ%3D%3D" loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
        Browser Anda tidak mendukung elemen audio.
      </audio>
    </main>
  );
};

export default App;