import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Coffee, 
  Cake, 
  IceCream, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Sparkle,
  ArrowLeft
} from "lucide-react";

// Types for the celebration falling particles
interface Particle {
  id: number;
  x: number; // percentage width
  delay: number; // delay in seconds
  duration: number; // fall duration in seconds
  size: number; // size in pixels
  rotation: number;
  type: "petal" | "heart" | "rose";
}

// Gorgeous, organic botanical corner decorators from the "Warm Organic / Cultural" style sheet template
const BotanicalTopLeft = () => (
  <div className="absolute top-0 left-0 w-32 h-32 md:w-56 md:h-56 text-[#8DAA91] opacity-65 pointer-events-none z-0">
    <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
      <path d="M40,0 Q60,40 100,40 Q60,60 40,100 Q20,60 0,40 Q20,40 40,0" />
      <circle cx="70" cy="20" r="8" />
      <path d="M120,10 Q140,50 180,50 Q140,70 120,110 Q100,70 80,50 Q120,50 120,10" opacity="0.5" />
    </svg>
  </div>
);

const BotanicalBottomRight = () => (
  <div className="absolute bottom-0 right-0 w-32 h-32 md:w-56 md:h-56 text-[#FCE4EC] opacity-65 pointer-events-none z-0 rotate-180">
    <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
      <path d="M40,0 Q60,40 100,40 Q60,60 40,100 Q20,60 0,40 Q20,40 40,0" />
      <circle cx="70" cy="20" r="8" />
      <path d="M120,10 Q140,50 180,50 Q140,70 120,110 Q100,70 80,50 Q120,50 120,10" opacity="0.5" />
    </svg>
  </div>
);

// We keep the lovely retro Music Box using the browser's built-in Web Audio API untouched
let audioCtx: AudioContext | null = null;
let melodyInterval: any = null;

export default function App() {
  const [screen, setScreen] = useState<number>(1);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState<boolean>(false);
  const [celebrating, setCelebrating] = useState<boolean>(false);
  
  // No button dodging & dialogue state
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [noSpeechBubble, setNoSpeechBubble] = useState("Wait, don't click this! 🫣");
  const verdictContainerRef = useRef<HTMLDivElement>(null);
  
  // Celebration state
  const [particles, setParticles] = useState<Particle[]>([]);

  // Sound effect triggers for emotional, cozy feedback
  const playButtonTap = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio context might fail block on non-interacted page load
    }
  };

  const playUnlockSound = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      
      const chord = [329.63, 440.00, 523.25, 659.25]; // E4, A4, C5, E5
      chord.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
      });
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.52);
    } catch (e) {}
  };

  const toggleMusicBox = () => {
    const nextState = !isMelodyPlaying;
    setIsMelodyPlaying(nextState);
    
    if (nextState) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioCtxClass();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      
      // Infinite music box chime algorithm Cmaj7 - Am7 - Fmaj7 - G6 chords
      const progression = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
        [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
        [349.23, 440.00, 523.25, 659.25], // Fmaj7 (F4, A4, C5, E5)
        [392.00, 493.88, 587.33, 659.25], // G6 (G4, B4, D5, E5)
      ];
      
      let chordIdx = 0;
      let noteIdx = 0;
      
      const playChime = (freq: number, triggerTime: number) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "triangle"; // Soft music box hammer resonance
        osc.frequency.setValueAtTime(freq, triggerTime);
        
        gain.gain.setValueAtTime(0.08, triggerTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, triggerTime + 1.8);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(triggerTime);
        osc.stop(triggerTime + 1.8);
      };
      
      const cycle = () => {
        const chord = progression[chordIdx];
        const freq = chord[noteIdx];
        if (audioCtx) {
          playChime(freq, audioCtx.currentTime);
        }
        
        noteIdx++;
        if (noteIdx >= chord.length) {
          noteIdx = 0;
          chordIdx = (chordIdx + 1) % progression.length;
        }
      };
      
      cycle();
      melodyInterval = setInterval(cycle, 450);
    } else {
      if (melodyInterval) clearInterval(melodyInterval);
    }
  };

  useEffect(() => {
    return () => {
      if (melodyInterval) clearInterval(melodyInterval);
    };
  }, []);

  // Dodge algorithm: keeps button inside the parent containment zone beautifully
  const handleNoButtonDodge = () => {
    setNoHoverCount((prev) => prev + 1);
    
    const bubblePhrases = [
      "Access Denied: Logic module failure 🧐",
      "But... the 73% behaving promise! 🥺",
      "Wait! The chocolate cake is gooey! 🎂",
      "Dimethyl-chaos formula warning! 🧪",
      "Error 404: Ahmedabad 'No' not found! ❌",
      "No is mathematically locked! ➗",
      "Dimple tax must be paid in full! 🪙",
      "My puppy eyes are too powerful! 🐶",
      "Your curls are far too pretty to say no 🌸",
      "Ahmedabad is calling your name! ✈️",
      "Logic.exe has stopped working! 💻"
    ];
    
    const randomPhrase = bubblePhrases[Math.floor(Math.random() * bubblePhrases.length)];
    setNoSpeechBubble(randomPhrase);
    
    if (!verdictContainerRef.current) return;
    const containerRect = verdictContainerRef.current.getBoundingClientRect();
    
    const padding = 20;
    const buttonWidth = 180;
    const buttonHeight = 50;
    
    const maxRangeX = containerRect.width / 2 - buttonWidth - padding;
    const maxRangeY = containerRect.height / 3 - buttonHeight - padding;
    
    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;
    
    const jumpX = signX * (45 + Math.random() * maxRangeX);
    const jumpY = signY * (35 + Math.random() * maxRangeY);
    
    setNoOffset({ x: jumpX, y: jumpY });
  };

  const handleYesVote = () => {
    playUnlockSound();
    setCelebrating(true);
    
    const generated: Particle[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3.5,
      duration: 3.5 + Math.random() * 4,
      size: 14 + Math.random() * 22,
      rotation: Math.random() * 320,
      type: i % 3 === 0 ? "petal" : i % 3 === 1 ? "heart" : "rose",
    }));
    
    setParticles(generated);
  };

  return (
    <div 
      id="proposal-layout-root"
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-6 md:py-10 bg-[#FDFBF7] text-[#4A4A4A] transition-colors duration-500 selection:bg-[#F3E8FF] overflow-hidden select-none font-sans"
    >
      {/* Corner Botanical Vibe Overlays (Styled in accordance with Warm Organic / Cultural instructions) */}
      <BotanicalTopLeft />
      <BotanicalBottomRight />

      {/* Floating Sparkles & Soft Interactive Background Blobs using actual pastel palette offsets */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#F3E8FF]/30 rounded-full filter blur-2xl pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#FCE4EC]/30 rounded-full filter blur-3xl pointer-events-none z-0"></div>

      {/* Celebrating Petal Rain Overlay */}
      {celebrating && (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute text-center select-none"
              style={{
                left: `${p.x}%`,
                top: "-10%",
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                transform: `rotate(${p.rotation}deg)`,
              }}
            >
              <div 
                className="animate-fall"
                style={{
                  animationDuration: `${p.duration}s`,
                  animationTimingFunction: "linear",
                }}
              >
                {p.type === "petal" && (
                  <svg className="fill-[#D8B4FE]/60 stroke-[#D8B4FE]/25" width={p.size} height={p.size} viewBox="0 0 24 24">
                    <path d="M12 2C12 2 5 9 5 14C5 18 8.5 21 12 21C15.5 21 19 18 19 14C19 9 12 2 12 2Z" />
                  </svg>
                )}
                {p.type === "heart" && (
                  <Heart size={p.size} className="fill-[#FCE4EC] text-pink-300" />
                )}
                {p.type === "rose" && (
                  <svg className="fill-[#FCE4EC]/50 stroke-pink-200" width={p.size} height={p.size} viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18Z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styled Header Container */}
      <header id="proposal-header" className="w-full max-w-5xl z-10 flex justify-between items-center px-2 py-3 border-b border-[#D8B4FE]/30 mb-2">
        <div className="flex items-center space-x-2">
          <span className="p-1 px-2.5 text-xs font-mono tracking-widest text-[#3D3D3D] bg-white rounded-full border border-[#D8B4FE]/40 font-semibold shadow-sm">
            ⚖️ CASE FILE: #AHD-143
          </span>
        </div>
        
        {/* Whimsical Audio Synthesizer Controller with themed borders & backgrounds */}
        <div className="flex items-center space-x-3">
          {isMelodyPlaying && (
            <div className="hidden sm:flex items-end gap-[2.2px] h-3">
              <span className="w-[2px] h-2 bg-[#8DAA91] animate-pulse"></span>
              <span className="w-[2px] h-3 bg-[#D8B4FE] animate-pulse delay-75"></span>
              <span className="w-[2px] h-1.5 bg-[#8DAA91] animate-pulse delay-150"></span>
              <span className="w-[2px] h-2.5 bg-[#D8B4FE] animate-pulse delay-100"></span>
            </div>
          )}
          <button
            id="music-box-toggle"
            onClick={toggleMusicBox}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-[#D8B4FE] bg-white shadow-sm hover:bg-[#F3E8FF] transition-all cursor-pointer text-[#4A4A4A] hover:text-[#3D3D3D] hover:scale-105 active:scale-95"
            title="Lullaby music box"
          >
            {isMelodyPlaying ? (
              <>
                <Volume2 size={13} className="text-[#8DAA91] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Music Box: On 🌸</span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-gray-400" />
                <span>Play Chime Box 🔮</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Multi-Screen Core Layout styled with the warm Georgia/serif & Inter/sans typography pairing */}
      <main id="proposal-main-content" className="w-full max-w-5xl flex-grow flex items-center justify-center py-6 md:py-12 z-10">
        <AnimatePresence mode="wait">
          {screen === 1 && (
            <motion.section
              key="screen-1"
              id="landing-appeal"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-center"
            >
              {/* Left hand details text with warm colors applied */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
                <div className="space-y-3">
                  <span className="text-[#8DAA91] text-xs uppercase tracking-[0.3em] font-sans font-bold flex items-center gap-1.5">
                    <Sparkle size={12} className="fill-[#FCE4EC] text-[#8DAA91]" /> Exclusively for Rheeya
                  </span>
                  <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-tight text-[#3D3D3D] leading-tight">
                    Welcome to the Official Appeal Room of the Evaluation Committee
                  </h1>
                  <p className="text-[#8DAA91] text-sm md:text-lg tracking-wide font-medium italic pl-1 flex items-center gap-2">
                    <Coffee size={16} className="text-[#D8B4FE] animate-bounce" />
                    Presented by your favorite high-energy, caffeinated puppy.
                  </p>
                </div>

                {/* Testimony card bordered beautifully in Lavender & Slate */}
                <div className="relative bg-white border-l-4 border-l-[#D8B4FE] p-6 md:p-8 rounded-xl shadow-sm space-y-4 text-left border border-gray-100">
                  {/* Visual sticky note from the committee room */}
                  <div className="absolute -top-3 -right-2 bg-[#FDFBF7] text-[#8DAA91] font-cursive text-[10px] md:text-xs z-10 px-3 py-1 rounded border border-[#D8B4FE]/40 rotate-3 shadow-sm select-none">
                     No logic allowed! 🤐
                  </div>
                  
                  <p className="font-serif italic text-gray-700 border-l-2 border-[#D8B4FE]/40 pl-4 text-sm md:text-base">
                    "To the Chairperson of the Jury, Bringer of Memories, and Guardian of Premium Membership Chaos..."
                  </p>
                  
                  <p className="text-[#555] text-sm md:text-base leading-relaxed pl-1 font-sans">
                    I know logic dictates that moving this fast is a scary baseline. But luckily for both of us, logic has never been my strongest quality when I genuinely enjoy someone’s company. You explicitly stated that you weren't going to ask, and that if I wanted a date, I had to properly, formally ask you out for one. 
                  </p>
                  <p className="text-[#555] text-sm md:text-base leading-relaxed pl-1 font-sans">
                    So, I dropped the subtle mode, retired from my detective career for the night, and built this instead.
                  </p>
                </div>

                <div className="pt-2 pl-1">
                  <button
                    id="step-inside-btn"
                    onClick={() => {
                      playUnlockSound();
                      setScreen(2);
                    }}
                    className="group flex items-center gap-2.5 bg-white border border-[#D8B4FE] text-[#3D3D3D] font-serif font-medium px-8 py-4 rounded-full shadow-sm cursor-pointer duration-200 hover:bg-[#F3E8FF] hover:shadow-md hover:scale-[1.03] active:scale-98 transition-all text-lg md:text-xl"
                  >
                    <span>[Step Inside the AC Room]</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#8DAA91]" />
                  </button>
                </div>
              </div>

              {/* Right hand layout showing beautiful Polaroid with the user's custom photo */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center py-6 relative min-h-[360px] md:min-h-[460px] mt-6 lg:mt-0">
                {/* Visual backboard with warm lights theme */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FCE4EC]/30 via-white/40 to-[#F3E8FF]/30 rounded-2xl border border-dashed border-[#D8B4FE]/40 pointer-events-none"></div>

                {/* Exhibit: The user's singular beautiful photograph framed with custom rotate and style */}
                <motion.div 
                  initial={{ rotate: -2, y: 10, opacity: 0 }}
                  animate={{ rotate: 1, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  whileHover={{ rotate: -1, scale: 1.03, zIndex: 30 }}
                  className="bg-white p-4 pb-8 rounded-xl shadow-md border border-[#D8B4FE]/20 w-72 md:w-80 cursor-pointer z-10 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative aspect-3/4 overflow-hidden rounded-md bg-gray-50 border border-gray-100">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1WKAh_9Pxst3ND6vABotsHVJne8Y4U-cb" 
                      alt="Rheeya and friend on a beautiful Bangalore stroll" 
                      className="w-full h-full object-cover contrast-[102%] brightness-[101%]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-yellow-500/0 mix-blend-overlay"></div>
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#8DAA91] to-[#D8B4FE] text-white text-[10px] px-3 py-1 rounded-full font-mono tracking-wider font-bold shadow-sm">
                      EXHIBIT A
                    </div>
                  </div>
                  <div className="mt-4 font-cursive text-center text-[#3D3D3D] text-sm md:text-base tracking-wide font-medium">
                    Bangalore strolls & stunning curls! ☕✨
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {screen === 2 && (
            <motion.section
              key="screen-2"
              id="arguments-cards"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col space-y-8 w-full animate-fade"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[#8DAA91] text-xs uppercase tracking-[0.3em] font-sans font-bold uppercase block">
                  🛡️ STATEMENT OF EVIDENCE
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-[#3D3D3D] leading-tight font-medium">
                  Case File: The ROI of an Ahmedabad Detour
                </h2>
                <p className="text-gray-500 text-xs md:text-sm font-sans">
                  Reviewing three pivotal structural clauses designed entirely for comfort and safety.
                </p>
              </div>

              {/* 3 Text Cards styled with beautiful organic border-l-4 in lavender, and creamy beige cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Clause 1 */}
                <motion.div 
                  id="safety-clause-card"
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white border-l-4 border-l-[#D8B4FE] p-6 md:p-8 rounded-xl shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center border border-[#D8B4FE]/30 text-[#8DAA91]">
                      <ShieldCheck size={20} className="text-[#8DAA91] animate-pulse" />
                    </div>
                    <div>
                      <h3 className="romantic-serif text-xl font-bold text-[#8DAA91] font-serif">
                        1. The Safety Clause
                      </h3>
                      <p className="text-xs font-mono text-gray-400 mt-1">
                        Leeway Factor: ∞ | Speed: 0.5x
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-[#555555]">
                      Before we talk about any plans, let's establish the ground rules. There is zero pressure here. I know the world has been unfair to you, and you've had to carry an unfair amount of baggage entirely on your own. You asked for patience, leeway, and emotional safety—and you have it. We can move at 0.5x speed. Your comfort and your boundaries always come first.
                    </p>
                  </div>
                  
                  {/* Small decorative toggle */}
                  <div className="mt-5 border-t border-gray-100 pt-3 flex justify-between items-center bg-[#FDFBF7]/60 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-3 rounded-b-xl border-l-[4px] border-l-transparent text-gray-500">
                    <span className="text-[10px] font-mono text-slate-500">Couch Security Mode</span>
                    <span className="text-[10px] font-mono text-[#8DAA91] bg-white border border-[#D8B4FE]/35 px-2 py-0.5 rounded font-bold">Active ✔</span>
                  </div>
                </motion.div>

                {/* Clause 2 */}
                <motion.div 
                  id="craving-strategy-card"
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white border-l-4 border-l-[#D8B4FE] p-6 md:p-8 rounded-xl shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center border border-[#D8B4FE]/30 text-[#D8B4FE]">
                      <Cake size={20} className="text-[#D8B4FE]" />
                    </div>
                    <div>
                      <h3 className="romantic-serif text-xl font-bold text-[#8DAA91] font-serif">
                        2. The Craving Strategy
                      </h3>
                      <p className="text-xs font-mono text-gray-400 mt-1">
                        Chocolate Gooeyness: 100% | AC Level: Max
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-[#555555]">
                      You wanted to see some effort, so here is the concrete strategy for dealing with the Ahmedabad heat and period cravings. I am officially volunteering to show up at Bungalow 7, Madhav Villa Bungalows with one whole, freshly baked, gooey French chocolate cake and an unlimited supply of ice cream. No pizza and pasta street arguments—just pure comfort food, a hot bag, and an immediate escape route to the nearest high-functioning AC zone.
                    </p>
                  </div>

                  {/* Interactivity details */}
                  <div className="mt-5 border-t border-gray-100 pt-3 flex justify-between items-center bg-[#FDFBF7]/60 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-3 rounded-b-xl border-l-[4px] border-l-transparent text-gray-500">
                    <div className="flex items-center gap-1">
                      <IceCream size={12} className="text-pink-400" />
                      <span className="text-[10px] font-mono text-slate-500">Warm bag deployer: Ready</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#D8B4FE] bg-white border border-[#D8B4FE]/35 px-2 py-0.5 rounded font-bold">100% Gooey 🍫</span>
                  </div>
                </motion.div>

                {/* Clause 3 */}
                <motion.div 
                  id="percent-clause-card"
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white border-l-4 border-l-[#D8B4FE] p-6 md:p-8 rounded-xl shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center border border-[#D8B4FE]/30 text-[#FCE4EC]">
                      <Sparkles size={18} className="text-pink-300" />
                    </div>
                    <div>
                      <h3 className="romantic-serif text-xl font-bold text-[#8DAA91] font-serif">
                        3. The 27% Clause
                      </h3>
                      <p className="text-xs font-mono text-gray-400 mt-1">
                        73% behave rate guaranteed
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-[#555555]">
                      Liking food and me at the same time comes with distinct financial risks, but I promise the return on investment is worth it. I guarantee to be at least 73% well-behaved on our trip. The other 27% is harmless—mostly just extra teasing, stealing hugs, acting like I've known you forever, and quietly admiring your ridiculously pretty curls and those insane warm brown eyes.
                    </p>
                  </div>

                  {/* Interactive behavioural gauge slider with theme palette */}
                  <div className="mt-5 border-t border-gray-100 pt-3 flex flex-col space-y-1 bg-[#FDFBF7]/60 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-3 rounded-b-xl border-l-[4px] border-l-transparent text-gray-500">
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                      <span>😇 Well-Behaved (73%)</span>
                      <span>😈 Teasing & hugs (27%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#8DAA91]" style={{ width: '73%' }}></div>
                      <div className="h-full bg-[#D8B4FE]" style={{ width: '27%' }}></div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Transition buttons at page bottom */}
              <div className="pt-4 flex justify-between items-center">
                <button
                  id="back-to-appeal-btn"
                  onClick={() => {
                    playButtonTap();
                    setScreen(1);
                  }}
                  className="text-xs font-mono cursor-pointer text-gray-400 hover:text-[#8DAA91] transition-colors flex items-center gap-1.5 hover:underline font-semibold"
                >
                  <ArrowLeft size={13} />
                  <span>Return to Appeal</span>
                </button>

                <button
                  id="proceed-to-verdict-btn"
                  onClick={() => {
                    playUnlockSound();
                    setScreen(3);
                  }}
                  className="group flex items-center gap-2.5 bg-[#F3E8FF] text-[#3D3D3D] border border-transparent rounded-full px-8 py-4 shadow-sm hover:bg-white hover:border-[#D8B4FE] cursor-pointer duration-200 hover:shadow-md hover:scale-[1.03] active:scale-98 transition-all font-serif text-lg md:text-xl font-medium"
                >
                  <span>[Proceed to the Verdict] ⚖️</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#8DAA91]" />
                </button>
              </div>
            </motion.section>
          )}

          {screen === 3 && (
            <motion.section
              key="screen-3"
              id="formal-verdict"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-[#8DAA91] text-xs uppercase tracking-[0.3em] font-sans font-bold block">
                  ⚖️ COURT DATE IN SESSION
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-[#3D3D3D] leading-tight font-medium">
                  The Court Date is Due. What is the Verdict?
                </h2>
              </div>

              {/* Main official decree parchment styled card with Warm Organics border accent */}
              <div className="w-full bg-white border-l-4 border-l-[#D8B4FE] rounded-xl p-6 md:p-12 shadow-sm relative overflow-hidden flex flex-col items-center border border-gray-105">
                
                {/* Elegant lavender ribbon overlay */}
                <div className="absolute top-0 right-10 w-12 h-16 bg-gradient-to-b from-[#D8B4FE] to-[#c084fc] text-white flex items-center justify-center rounded-b shadow-md z-10">
                  <Heart size={18} className="fill-white animate-bounce" style={{ animationDuration: '2.5s' }} />
                </div>
                
                <p className="text-[#4A4A4A] text-lg md:text-xl leading-relaxed text-center font-serif italic max-w-2xl px-2">
                  "Rheeya, let's stop applying short-term practical logic to something that is very clearly becoming beautiful. I don't care if you think you look like an overbaked potato or a mess after work—to me, your entire energy when you talk passionately about social sector reforms or tease me is adorable."
                </p>
                <div className="my-6 w-16 h-[1px] bg-[#D8B4FE]"></div>
                <p className="text-[#4A4A4A] text-lg md:text-xl leading-relaxed text-center font-serif max-w-2xl px-2">
                  "Consider this my official application out of the friend zone. Will you drop the emotional yellow tape, call me to Ahmedabad, and let me take you on our very first official date?"
                </p>

                {/* Subtitle instructions on how to use */}
                <p className="text-[10px] font-mono text-[#D8B4FE] mt-8 select-none uppercase tracking-widest font-bold">
                  ⚠️ Decision is medically binding. Choose wisely:
                </p>

                {/* Bounded Container for Buttons (Constrains spring dodging beautifully) */}
                <div 
                  ref={verdictContainerRef}
                  id="decision-button-shield"
                  className="w-full max-w-2xl min-h-[140px] md:min-h-[160px] relative flex md:flex-row flex-col items-center justify-center gap-6 mt-8 pt-4 rounded-xl border border-dashed border-[#D8B4FE]/30 bg-[#FDFBF7]/50"
                >
                  {/* Speech Bubble above dodging No button */}
                  {noHoverCount > 0 && (
                    <motion.div
                      id="dodge-speech-bubble"
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${noOffset.x}px - 100px)`,
                        top: `calc(50% + ${noOffset.y}px - 62px)`
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-[#3D3D3D] text-[#FDFBF7] text-[11px] px-3.5 py-2 rounded-xl shadow-lg border border-[#D8B4FE]/50 text-center w-[200px] z-30 pointer-events-none font-sans font-medium"
                    >
                      {noSpeechBubble}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#3D3D3D]"></div>
                    </motion.div>
                  )}

                  {/* YES BUTTON */}
                  <button
                    id="yes-decision-btn"
                    onClick={handleYesVote}
                    className="z-10 group flex items-center gap-2 bg-[#D8B4FE] hover:bg-[#c084fc] text-white font-serif text-lg md:text-xl px-10 py-4 rounded-full shadow-md duration-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center justify-center cursor-pointer"
                  >
                    <Heart size={18} className="fill-white group-hover:scale-125 transition-transform text-pink-100" />
                    <span>YES - Call me to Ahmedabad</span>
                  </button>

                  {/* NO BUTTON (Dodging mechanism with spring framer motion) */}
                  <motion.button
                    id="no-decision-btn"
                    onMouseEnter={handleNoButtonDodge}
                    onClick={handleNoButtonDodge} // Touch fallback accessibility
                    style={{
                      position: noHoverCount > 0 ? 'absolute' : 'relative',
                    }}
                    animate={{
                      x: noOffset.x,
                      y: noOffset.y,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    className="z-20 bg-[#F3E8FF] border border-[#D8B4FE] text-[#8DAA91] font-serif text-lg md:text-xl px-10 py-4 rounded-full cursor-not-allowed select-none flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>NO - Suffer for 2 months</span>
                  </motion.button>
                </div>
              </div>

              {/* Bottom backtrack button */}
              <button
                id="back-to-clauses-btn"
                onClick={() => {
                  playButtonTap();
                  setScreen(2);
                }}
                className="text-xs font-mono cursor-pointer text-gray-400 hover:text-[#8DAA91] transition-colors flex items-center gap-1.5 hover:underline font-semibold"
              >
                <ArrowLeft size={13} />
                <span>Return to Case Arguments</span>
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Confirmation Modal overlay on YES vote */}
      <AnimatePresence>
        {celebrating && (
          <motion.div 
            id="verdict-celebration-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D3D3D]/30 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white border-4 border-[#F3E8FF] rounded-3xl p-6 md:p-10 max-w-lg w-full text-center shadow-2xl relative border-l-4 border-l-[#D8B4FE]"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-tr from-[#D8B4FE] to-[#FCE4EC] rounded-full flex items-center justify-center border-4 border-white shadow-lg text-[#3D3D3D]">
                <Sparkles size={36} className="animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              {/* Boarding pass styled graphic inside overlay */}
              <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#D8B4FE]/30 mt-6 space-y-4 text-left relative">
                <div className="flex justify-between items-center bg-[#8DAA91] text-white px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase font-bold">
                  <span>✈️ OFFICIAL BOARDING PASS</span>
                  <span className="animate-pulse">PRINcess class 👑</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-mono text-[#8DAA91] uppercase tracking-wider font-semibold">Boarding place</p>
                    <p className="font-serif font-semibold text-[#3D3D3D] text-sm md:text-base">Premium Chaos (BLR)</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-[#8DAA91] uppercase tracking-wider font-semibold">Destination</p>
                    <p className="font-serif font-semibold text-[#3D3D3D] text-sm md:text-base">Bungalow 7, Ahmedabad</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-[#8DAA91] uppercase tracking-wider font-semibold">Passenger</p>
                    <p className="font-cursive text-sm font-bold text-[#3D3D3D]">Rheeya (Pretty Curls)</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-[#8DAA91] uppercase tracking-wider font-semibold">Travel date</p>
                    <p className="font-serif text-xs md:text-sm text-[#3D3D3D] font-semibold">Immediate Date-With-Me 📅</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#D8B4FE]/40 pt-3">
                  <p className="text-[10px] font-mono text-purple-500 font-bold uppercase tracking-wider">CODEWORD STATUS INDICATOR:</p>
                  <p className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg inline-block mt-1 font-semibold">
                    [SLANG ZONE UPGRADED • NO STREET PASTA DISPUTES ALLOWED]
                  </p>
                </div>
              </div>

              <div className="my-6 space-y-2">
                <h3 className="text-xl md:text-2xl font-serif text-[#3D3D3D] font-medium">
                  Verdict accepted! 💗
                </h3>
                <p className="text-gray-650 text-xs md:text-sm leading-relaxed px-2 font-sans">
                  "Verdict accepted. Slang zone upgraded. Code words deployed. I'm booking the tickets—see you very soon, princess! 💗"
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  id="reset-verdict-btn"
                  onClick={() => {
                    playButtonTap();
                    setCelebrating(false);
                    setNoOffset({ x: 0, y: 0 });
                    setNoHoverCount(0);
                    setScreen(1);
                  }}
                  className="flex-1 border-2 border-[#D8B4FE] text-[#3D3D3D] font-serif py-3 rounded-full cursor-pointer hover:bg-[#F3E8FF] transition-all text-sm font-medium"
                >
                  Start Over (Again!) 🥹
                </button>
                
                <button
                  id="close-celebrate-btn"
                  onClick={() => setCelebrating(false)}
                  className="flex-1 bg-[#D8B4FE] text-white font-serif py-3 rounded-full cursor-pointer hover:bg-[#c084fc] transition-all shadow-sm text-sm font-medium"
                >
                  Close & Admire Flowers 🌸
                </button>
              </div>

              <div className="mt-4 text-[9px] font-mono text-gray-400 select-none">
                Bringer of Memories • Guardian of Premium Membership Chaos
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Footer for the committee design system */}
      <footer id="proposal-footer" className="w-full max-w-5xl text-center py-4 border-t border-[#D8B4FE]/20 text-[#8DAA91]/60 text-[10px] tracking-wide font-mono z-10">
        <div>MAINTAINED SECURELY FOR THE CHAIRPERSON OF THE JURY • AMD SPECIAL INSTRUCTIONS ⚖️</div>
        <div className="text-[9px] text-[#8DAA91] mt-1 uppercase font-semibold">● logic: bypassed | comfortable speed limit: 0.5x | high-energy levels: 100%</div>
      </footer>
    </div>
  );
}
