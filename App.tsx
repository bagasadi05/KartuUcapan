
import React, { useState, useRef, useEffect, useCallback } from 'react';
import EndlessLove from './components/MessageCard';
import FallingHearts from './components/FallingHearts';

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

const ReplayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
    </svg>
);

type SceneState = 'intro' | 'galaxy' | 'outro';

const App: React.FC = () => {
  const [sceneState, setSceneState] = useState<SceneState>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const perspectiveContainerRef = useRef<HTMLDivElement>(null);
  const starBgRef = useRef<HTMLDivElement>(null);
  // FIX: Changed NodeJS.Timeout to number as setTimeout in the browser returns a number.
  const inactivityTimer = useRef<number | null>(null);

  const fadeAudio = useCallback((direction: 'in' | 'out', duration: number = 1000) => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetVolume = direction === 'in' ? 1 : 0.2;
    const startVolume = audio.volume;
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = (targetVolume - startVolume) / steps;

    let currentStep = 0;
    const fade = setInterval(() => {
        currentStep++;
        if (currentStep > steps) {
            clearInterval(fade);
            audio.volume = targetVolume;
        } else {
            audio.volume = Math.max(0, Math.min(1, startVolume + volumeStep * currentStep));
        }
    }, stepTime);
  }, []);
  
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if(isPlaying) fadeAudio('in');
    inactivityTimer.current = setTimeout(() => {
        fadeAudio('out');
    }, 5000); // 5 seconds of inactivity
  }, [isPlaying, fadeAudio]);

  const handleOpenMessage = () => {
    if (sceneState !== 'intro') return;

    setSceneState('galaxy');
    
    if (audioRef.current) {
        audioRef.current.volume = 0;
        audioRef.current.play().catch(error => console.error("Audio autoplay failed:", error));
        fadeAudio('in', 2000);
    }
    setIsPlaying(true);
    resetInactivityTimer();
  };
  
  const handleReplay = () => {
    setSceneState('intro');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  useEffect(() => {
    if (sceneState !== 'galaxy') return;

    const handleInteraction = () => resetInactivityTimer();

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        if (!perspectiveContainerRef.current) return;
        const { beta, gamma } = event; // beta: X-axis, gamma: Y-axis

        if (beta === null || gamma === null) return;

        // Foreground rotation
        const x = Math.max(-30, Math.min(30, gamma)) / 2; // Clamp and reduce sensitivity
        const y = Math.max(-30, Math.min(30, beta)) / 2;
        perspectiveContainerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;

        // Background parallax
        if (starBgRef.current) {
            const bgX = gamma * -0.5;
            const bgY = beta * -0.5;
            starBgRef.current.style.transform = `translateX(${bgX}px) translateY(${bgY}px)`;
        }

        handleInteraction();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!mainRef.current || !perspectiveContainerRef.current) return;
        
        // Foreground rotation
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = mainRef.current;
        const x = (clientX / offsetWidth - 0.5) * 2; // -1 to 1
        const y = (clientY / offsetHeight - 0.5) * 2; // -1 to 1
        perspectiveContainerRef.current.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;

        // Background parallax
        if (starBgRef.current) {
            const bgX = x * -20;
            const bgY = y * -20;
            starBgRef.current.style.transform = `translateX(${bgX}px) translateY(${bgY}px)`;
        }

        handleInteraction();
    };
    
    // Use gyroscope on mobile, mouse on desktop
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
        mainRef.current?.addEventListener('mousemove', handleMouseMove);
    }
    
    // Outro transition timer
    const outroTimer = setTimeout(() => {
      setSceneState('outro');
    }, 55000); // 55 seconds until outro

    return () => {
      clearTimeout(outroTimer);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      mainRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sceneState, resetInactivityTimer]);


  return (
    <main 
        ref={mainRef}
        className="relative w-screen h-screen overflow-hidden bg-[#02010a] flex items-center justify-center antialiased"
    >
      <div className="absolute inset-0 nebula-bg"></div>
      <div
        ref={starBgRef}
        className="absolute inset-[-50px] star-bg transition-transform duration-300 ease-out"
        style={{ willChange: 'transform' }}
      ></div>

      {/* Intro Scene */}
      <div className={`absolute inset-0 z-10 flex items-center justify-center text-center p-4 transition-opacity duration-[1500ms] ease-in-out ${sceneState === 'intro' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-200 tracking-wider drop-shadow-[0_1px_5px_rgba(255,255,255,0.5)] mb-2">
                <span className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Di antara milyaran bintang...</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 drop-shadow-[0_1px_5px_rgba(255,255,255,0.5)] mb-8">
                <span className="animate-fade-in-up" style={{ animationDelay: '1.8s' }}>...ada satu yang paling spesial.</span>
              </p>
            <button
              onClick={handleOpenMessage}
              className="bg-pink-500/30 text-pink-200 p-6 rounded-full backdrop-blur-sm border border-pink-400/50 hover:bg-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-pulse-heart animate-fade-in-up"
              style={{ animationDelay: '3.5s' }}
              aria-label="Buka Pesan"
              disabled={sceneState !== 'intro'}
            >
              <HeartIcon />
            </button>
          </div>
      </div>
      
      {/* Galaxy Scene */}
      <div className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${sceneState === 'galaxy' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="galaxy-header">Pesan Cinta untuk Uswa</div>
        <FallingHearts />
        <div 
            ref={perspectiveContainerRef}
            className="absolute inset-0 perspective-container overflow-hidden"
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
      
      {/* Outro Scene */}
      <div className={`absolute inset-0 z-10 flex items-center justify-center text-center p-4 transition-opacity duration-[2500ms] ease-in-out ${sceneState === 'outro' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center">
              <h2 
                className="text-2xl sm:text-3xl text-gray-200 font-dancing tracking-wider drop-shadow-[0_1px_5px_rgba(255,255,255,0.5)] mb-4 animate-fade-in-up"
                style={{ animationDelay: '1s' }}
              >
                  Terima kasih telah menjadi semestaku.
              </h2>
              <p 
                className="text-lg text-gray-300 mb-8 animate-fade-in-up"
                style={{ animationDelay: '2.5s' }}
              >
                - Seseorang yang selalu mencintaimu
              </p>
            <button
              onClick={handleReplay}
              className="bg-pink-500/30 text-pink-200 p-4 rounded-full backdrop-blur-sm border border-pink-400/50 hover:bg-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400 flex items-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '4s' }}
              aria-label="Mulai Lagi"
            >
              <ReplayIcon />
              <span className="text-sm">Mulai Lagi</span>
            </button>
          </div>
      </div>

      <audio ref={audioRef} src="https://d2n7fc0kw20ri7.cloudfront.net/3ezny%2Ffile%2F2f3f9f1d8ddc931c06a1cd2990b83b6f_328e37955982737ec1f82026766c53b6.mp3?response-content-disposition=inline%3Bfilename%3D%222f3f9f1d8ddc931c06a1cd2990b83b6f_328e37955982737ec1f82026766c53b6.mp3%22%3B&response-content-type=audio%2Fmpeg&Expires=1756837741&Signature=NxWe-O-I9NWZ5DY0VLIgMqOq95Bbg4lnajIYrvnXJdZOGq0pvgt0iF6bdg05BAVKHiGiJgV9ZunGNAjr9BPc0IPbQhKCOR3ckHwi96Hh8IvzRgHdlPYBn0e5luOFbXBulFX1tbQ84itJVVxs4ILanpxBOfESq4qxFO5s3Pwk7OY87gwcD69jH8Js4wZ7FZlyKQxrY5TgoD3MMCOze~OwVc8wqPwaP57jsjAOXHwEvD09CBanZ-ey6zVP1ihhWpB70gqBX5rMYtSotCiugVkQbIFbXMLVOokQrbN6PBDFJSncC8a4MDlrEO6Tuh3aQzJxuMK7GfUAW52wmd-nGjbJjg__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ" loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
        Browser Anda tidak mendukung elemen audio.
      </audio>
    </main>
  );
};

export default App;