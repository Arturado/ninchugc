/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ChatBot } from "./components/ChatBot";
import { SignUpModal } from "./components/SignUpModal";
import CustomCursor from "./components/CustomCursor";

// Audio URLs (Royalty Free)
const HOVER_SOUND_URL = "https://www.soundjay.com/buttons/sounds/button-16.mp3"; 

// Background Video Component moved outside for stability
const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force properties that are critical for mobile autoplay
    video.muted = true;
    video.defaultMuted = true;
    
    const attemptPlay = async () => {
      try {
        await video.play();
        setIsReady(true);
      } catch (err) {
        console.warn("Autoplay blocked, waiting for interaction");
        // Aunque el autoplay se bloquee, mostramos el video (frame congelado)
        // para no dejar la pantalla en negro hasta el primer click.
        setIsReady(true);
      }
    };

    attemptPlay();

    // Global listener for first user interaction to force play
    const forcePlay = () => {
      if (video.paused) {
        video.play().then(() => setIsReady(true)).catch(e => console.error(e));
      }
      window.removeEventListener('touchstart', forcePlay);
      window.removeEventListener('click', forcePlay);
    };

    window.addEventListener('touchstart', forcePlay, { passive: true });
    window.addEventListener('click', forcePlay, { passive: true });

    return () => {
      window.removeEventListener('touchstart', forcePlay);
      window.removeEventListener('click', forcePlay);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        preload="auto"
        onLoadedData={() => setIsReady(true)}
        className={`w-full h-full object-cover contrast-110 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        src={`${import.meta.env.BASE_URL}hf_20260514_204915_7a5662f9-a1d4-408f-bb6d-699aaec0ce8e.mp4`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
};

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorRotation = useMotionValue(0);
  
  const mouseRef = useRef({ x: 0, y: 0 });

  // Suavizado para movimientos fluidos
  const springConfig = { stiffness: 150, damping: 25 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const rotatedCursor = useSpring(cursorRotation, { stiffness: 200, damping: 30 });

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Efectos de inclinación y movimiento para la "flor" 3D
  const flowerRotateX = useSpring(useTransform(mouseY, [0, 1000], [10, -10]), springConfig);
  const flowerRotateY = useSpring(useTransform(mouseX, [0, 1920], [-10, 10]), springConfig);
  const flowerX = useSpring(useTransform(mouseX, [0, 1920], [-20, 20]), springConfig);
  const flowerY = useSpring(useTransform(mouseY, [0, 1000], [-20, 20]), springConfig);

  const playHoverSound = () => {
    try {
      const audio = new Audio(HOVER_SOUND_URL);
      audio.volume = 0.15; // Subtle volume for hover
      audio.play().catch(() => {});
    } catch (e) {
      console.log("Hover sound failed");
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        cursorRotation.set(angle);
      }
      
      mouseRef.current = { x: e.clientX, y: e.clientY };
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, cursorRotation]);

  return (
    <div 
      className="relative h-screen w-full bg-black overflow-hidden selection:bg-[#0022ff] selection:text-white font-sans flex flex-col cursor-none"
    >
      <CustomCursor />
      
      <div className="absolute inset-0 z-0">
        <BackgroundVideo />
        {/* Mobile-only overlay for better readability */}
        <div className="absolute inset-0 bg-black/40 md:hidden pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>
      
      <ChatBot />

      {/* Header Logo */}
      <header className="absolute top-6 right-6 md:top-10 md:right-10 z-50 flex items-center">
        <motion.div 
          whileHover={{ 
            scale: 1.02,
            y: -2,
            filter: "brightness(1.1)"
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25 
          }}
          className="cursor-pointer"
        >
          <img 
            src={`${import.meta.env.BASE_URL}UGC-Landing-NINCH_Logo-1.svg`} 
            alt="NINCH Logo" 
            className="h-[23px] md:h-8 w-auto brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </header>

      {/* Hero Section Container */}
      <main className="relative h-full w-full flex flex-col items-center justify-center p-0">
        
        {/* Main 3D Floating Element (Your Image) occupies the background top-left corner */}
        <motion.div 
          className="absolute left-[-22%] top-[-15%] md:top-[-35%] w-[47%] md:w-[34%] h-auto z-0 pointer-events-none blur-[6px] opacity-85"
          style={{ 
            rotateX: flowerRotateX, 
            rotateY: flowerRotateY,
            x: flowerX,
            y: flowerY
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0]
          }}
          transition={{ 
            opacity: { duration: 1.5 },
            scale: { duration: 1.5, ease: "easeOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}FLOR_blanca-con_lineas.png`} 
            alt="STAGE 3D Hub Background" 
            className="w-full h-auto drop-shadow-2xl select-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Second smaller highlight FLOR - 60% smaller, no blur */}
        <motion.div 
          className="absolute left-[-5%] md:left-[5%] top-[0%] md:top-[-10%] w-[22%] md:w-[16%] h-auto z-10 pointer-events-none opacity-100"
          style={{ 
            rotateX: flowerRotateY, // Slightly inverted rotation for variety
            rotateY: flowerRotateX,
            x: useTransform(flowerX, (v) => -v * 1.5), // More reactive
            y: useTransform(flowerY, (v) => -v * 1.5)
          }}
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, 20, 0],
            rotate: [-15, -5, -15]
          }}
          transition={{ 
            opacity: { duration: 2, delay: 0.5 },
            scale: { duration: 2, ease: "easeOut" },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}FLOR_blanca-con_lineas.png`} 
            alt="STAGE 3D Hub Highlight" 
            className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,34,255,0.3)] select-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Unified Content Block to be centered */}
        <div className="w-full flex flex-col items-center gap-6 lg:gap-8 z-40 mt-0 md:mt-12">
          
          {/* Brand Content Stack */}
          <div className="w-full flex flex-col items-center text-center gap-4">
            
            {/* Identity: Huge STAGE Title */}
            <div className="w-full">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex justify-center"
              >
                <h1 className="stage-title text-white font-[900] select-none whitespace-nowrap w-full">
                  Stage
                </h1>
              </motion.div>
            </div>

            {/* Messaging */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex flex-col items-center w-full max-w-[90vw] md:max-w-[72vw] px-6 lg:px-24"
            >
              <div className="w-full flex justify-center">
                <h2 className="text-[2.5rem] md:text-[3.8vw] leading-[0.95] heading-druk text-white uppercase text-center px-4 md:px-0">
                  El nuevo hub UGC de NINCH<sup>®</sup>
                </h2>
              </div>
              
              <div className="w-full mt-2">
                <p className="text-[22px] md:text-[26px] font-medium leading-[1.05] text-white opacity-95 text-center">
                  Conectamos <span className="font-bold">top brands con creadores</span> para transformar contenido auténtico en conversación cultural combinando <span className="font-bold">estrategia y creatividad.</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Global CTA Section */}
          <div className="w-full flex flex-col items-center gap-3 lg:gap-4 px-6 lg:px-24">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center group"
            >
              <h3 className="text-3xl lg:text-4xl font-black text-white group-hover:scale-105 transition-transform text-white">¿Querés ser parte?</h3>
              <p className="text-[30px] lg:text-[50px] font-black uppercase text-white leading-none heading-druk">BE ON</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
              <motion.button 
                onMouseEnter={playHoverSound}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  rest: { backgroundColor: "#0022ff", color: "#ffffff" },
                  hover: { backgroundColor: "#ffffff", color: "#0022ff", scale: 1.05 },
                  tap: { scale: 0.95 }
                }}
                className="btn-primary text-xs h-[46px] px-10"
                onClick={() => setIsSignUpOpen(true)}
              >
                <motion.div
                  variants={{
                    rest: { opacity: 0, x: -10, width: 0, marginRight: 0 },
                    hover: { opacity: 1, x: 0, width: "auto", marginRight: 12 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center overflow-hidden"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
                <span className="font-normal uppercase">SI SOS CREATOR</span>
              </motion.button>

              <motion.button 
                onMouseEnter={playHoverSound}
                onClick={() => { window.location.href = "mailto:newbusiness@ninchcompany.com"; }}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  rest: { backgroundColor: "#0022ff", color: "#ffffff" },
                  hover: { backgroundColor: "#ffffff", color: "#0022ff", scale: 1.05 },
                  tap: { scale: 0.95 }
                }}
                className="btn-secondary text-xs h-[46px] px-10"
              >
                <motion.div
                  variants={{
                    rest: { opacity: 0, x: -10, width: 0, marginRight: 0 },
                    hover: { opacity: 1, x: 0, width: "auto", marginRight: 12 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center overflow-hidden"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
                <span className="font-normal uppercase">SI SOS MARCA</span>
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
      />

      {/* Background Ambience Layers */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-white rounded-full blur-[180px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#0022ff] rounded-full blur-[200px] opacity-10" />
      </div>
    </div>
  );
}