
import React, { useState, useRef, useEffect, useCallback } from 'react';
import BirthdayMessages from './components/MessageCard';
import FallingConfetti from './components/FallingConfetti';

const GiftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 7h-2.18A3 3 0 0 0 12 5.76 3 3 0 0 0 6.18 7H4a2 2 0 0 0-2 2v3h20V9a2 2 0 0 0-2-2Zm-9 0H9a1 1 0 1 1 1-1c0 .37.2.72.52.9.15.07.31.1.48.1Zm4 0h-2c.17 0 .33-.03.48-.1A1 1 0 0 0 14 6a1 1 0 1 1 1 1ZM3 14v6a2 2 0 0 0 2 2h6v-8H3Zm10 8h6a2 2 0 0 0 2-2v-6h-8v8Z" />
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

type SceneState = 'intro' | 'opening' | 'galaxy' | 'outro';

const SONG_TITLE = "Tulus - Monokrom";
const SONG_AUDIO_URL = "/audio/Tulus%20-%20Monokrom%20%20Lirik%20Lagu%20Indonesia.mp3";

const coreWishes = [
  'Semoga langkahmu makin yakin, tanpa harus terburu-buru membuktikan apa pun.',
  'Semoga ada banyak ruang untuk tumbuh, mencoba lagi, dan tetap merasa cukup.',
  'Semoga hal-hal baik datang dengan cara yang paling kamu butuhkan.',
];

const App: React.FC = () => {
  const [sceneState, setSceneState] = useState<SceneState>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const perspectiveContainerRef = useRef<HTMLDivElement>(null);
  const starBgRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<number | null>(null);
  const fadeRAF = useRef<number | null>(null);
  const openingTimer = useRef<number | null>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'audio';
    link.href = SONG_AUDIO_URL;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
      if (openingTimer.current) clearTimeout(openingTimer.current);
    };
  }, []);

  const fadeAudio = useCallback((direction: 'in' | 'out', duration: number = 1000) => {
    if (!audioRef.current) return;
    if (fadeRAF.current) cancelAnimationFrame(fadeRAF.current);

    const startTime = performance.now();
    const startVolume = audioRef.current.volume;
    const targetVolume = direction === 'in' ? 1 : 0.2;

    const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(1, elapsedTime / duration);
        
        if(audioRef.current) {
            audioRef.current.volume = startVolume + (targetVolume - startVolume) * progress;
        }

        if (progress < 1) {
            fadeRAF.current = requestAnimationFrame(animate);
        }
    };

    fadeRAF.current = requestAnimationFrame(animate);
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
    if (audioRef.current) {
        audioRef.current.volume = 0;
    }
    setAudioError(false);
    audioRef.current?.play()
        .then(() => fadeAudio('in', 1800))
        .catch(() => setAudioError(true));
    setSceneState('opening');
    openingTimer.current = setTimeout(() => {
        setSceneState('galaxy');
    }, 2600);
  };
  
  useEffect(() => {
    // Start music and fade in when galaxy scene starts
    if (sceneState === 'galaxy') {
      if (audioRef.current) {
        audioRef.current.volume = Math.max(audioRef.current.volume, 0.35);
      }
      resetInactivityTimer();
    }
  }, [sceneState, fadeAudio, resetInactivityTimer]);

  const handleReplay = () => {
    if (openingTimer.current) clearTimeout(openingTimer.current);
    setSceneState('intro');
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }

  const togglePlayPause = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (audioEl.paused) {
      setAudioError(false);
      audioEl.play().catch(() => setAudioError(true));
    } else {
      audioEl.pause();
    }
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
    }, 68000); // Leave room for the final pop-up message.

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
          <div className="secret-card flex flex-col items-center">
              <div className="secret-kicker animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                sealed message
              </div>
              <h2 className="max-w-[18rem] sm:max-w-none text-[1.55rem] sm:text-3xl md:text-5xl leading-tight text-gray-100 tracking-wider drop-shadow-[0_1px_8px_rgba(255,255,255,0.42)] mb-3">
                <span className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Ada rahasia kecil di sini.</span>
              </h2>
              <p className="max-w-[19rem] sm:max-w-md text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed drop-shadow-[0_1px_5px_rgba(255,255,255,0.35)] mb-7">
                <span className="animate-fade-in-up" style={{ animationDelay: '1.25s' }}>Disimpan dulu di antara bintang. Buka pelan-pelan, nanti baru ketahuan untuk siapa.</span>
              </p>
              <p className="secret-warning animate-fade-in-up" style={{ animationDelay: '1.65s' }}>
                Jangan diskip dulu ya, ada kejutan kecil di akhir.
              </p>
              <div className="secret-code animate-fade-in-up" style={{ animationDelay: '1.9s' }}>
                <span></span><span></span><span></span>
              </div>
            <button
              onClick={handleOpenMessage}
              className="gift-button bg-amber-400/25 text-amber-100 p-6 rounded-full backdrop-blur-sm border border-amber-300/50 hover:bg-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-300 animate-pulse-gift animate-fade-in-up"
              style={{ animationDelay: '2.6s' }}
              aria-label="Buka Pesan"
              disabled={sceneState !== 'intro'}
            >
              <GiftIcon />
            </button>
          </div>
      </div>

      {/* Opening Scene */}
      <div className={`absolute inset-0 z-20 flex items-center justify-center text-center p-4 transition-opacity duration-700 ease-in-out ${sceneState === 'opening' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="opening-orbit">
          <div className="opening-ring"></div>
          <div className="opening-gift">
            <GiftIcon />
          </div>
          <p className="opening-text">Membuka pesan...</p>
          <p className="opening-hint">Tonton sampai selesai, ada yang disimpan di ujungnya.</p>
        </div>
      </div>
      
      {/* Galaxy Scene */}
      <div className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${sceneState === 'galaxy' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="galaxy-header">
          <span>Selamat ulang tahun</span>
          <strong>Maya Amanda ke-23</strong>
          <span>10 Mei 2026</span>
        </div>
        <FallingConfetti />
        <section className="reveal-card" aria-label="Ucapan utama">
          <p>for today&apos;s star</p>
          <h1>Maya Amanda</h1>
          <span>Chapter 23 · 10 Mei 2026</span>
        </section>
        <section className="core-card" aria-label="Pesan ulang tahun">
          <div className="core-badge">23</div>
          <p className="core-kicker">Untuk Maya Amanda</p>
          <h2>Selamat ulang tahun.</h2>
          <p className="core-copy">
            Di usia baru ini, semoga kamu tidak hanya mengejar hari yang besar,
            tapi juga menemukan bahagia di hal-hal kecil yang sering lewat diam-diam.
          </p>
          <div className="core-wishes">
            {coreWishes.map((wish) => (
              <span key={wish}>{wish}</span>
            ))}
          </div>
        </section>
        <div 
            ref={perspectiveContainerRef}
            className="absolute inset-0 perspective-container overflow-hidden"
          >
            <BirthdayMessages />
        </div>
        <button
          onClick={togglePlayPause}
          className="fixed bottom-5 right-5 z-20 bg-amber-400/25 text-amber-100 p-4 rounded-full backdrop-blur-sm border border-amber-300/50 hover:bg-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.45)] hover:shadow-[0_0_25px_rgba(251,191,36,0.65)] transition-all duration-300"
          aria-label={isPlaying ? `Pause ${SONG_TITLE}` : `Play ${SONG_TITLE}`}
          title={SONG_TITLE}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        {audioError && (
          <div className="fixed bottom-24 right-5 z-20 max-w-[16rem] rounded-xl border border-amber-300/30 bg-black/45 px-4 py-3 text-right text-xs font-semibold leading-relaxed text-amber-100/85 backdrop-blur-md">
            Audio belum ditemukan: {SONG_TITLE}
          </div>
        )}
      </div>
      
      {/* Outro Scene */}
      <div className={`absolute inset-0 z-10 flex items-center justify-center text-center p-4 transition-opacity duration-[2500ms] ease-in-out ${sceneState === 'outro' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="final-card flex flex-col items-center">
              <p className="final-kicker animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
                satu pesan terakhir
              </p>
              <h2
                className="animate-fade-in-up"
                style={{ animationDelay: '1s' }}
              >
                  Untuk tahun yang baru,
              </h2>
              <p
                className="final-message animate-fade-in-up"
                style={{ animationDelay: '2s' }}
              >
                semoga kamu selalu punya hati yang tenang untuk menerima yang sudah lewat,
                keberanian untuk memilih yang baik, dan alasan kecil untuk tersenyum setiap hari.
              </p>
              <p
                className="final-signature animate-fade-in-up"
                style={{ animationDelay: '3.1s' }}
              >
                Selamat 23 tahun, Maya Amanda. Teruslah tumbuh dengan caramu.
              </p>
            <button
              onClick={handleReplay}
              className="bg-amber-400/25 text-amber-100 p-4 rounded-full backdrop-blur-sm border border-amber-300/50 hover:bg-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-300 flex items-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '4.2s' }}
              aria-label="Mulai Lagi"
            >
              <ReplayIcon />
              <span className="text-sm">Mulai Lagi</span>
            </button>
          </div>
      </div>

      <audio
        ref={audioRef}
        src={SONG_AUDIO_URL}
        preload="auto"
        playsInline
        loop
        crossOrigin="anonymous"
        onError={() => setAudioError(true)}
        onCanPlay={() => setAudioError(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </main>
  );
};

export default App;
