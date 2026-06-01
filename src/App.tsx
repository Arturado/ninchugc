/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ChatBot } from "./components/ChatBot";

// Audio URLs (Royalty Free)
const HOVER_SOUND_URL = "https://www.soundjay.com/buttons/sounds/button-16.mp3"; 

const FluidTrail = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const [points, setPoints] = useState<{ x: number, y: number, id: number, age: number }[]>([]);
  const idCounter = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateTrail = () => {
      const x = mouseX.get();
      const y = mouseY.get();
      const now = Date.now();

      // Add new point if mouse moved
      if (Math.abs(x - lastPos.current.x) > 1 || Math.abs(y - lastPos.current.y) > 1) {
        setPoints(prev => [
          { x, y, id: idCounter.current++, age: now },
          ...prev
        ].slice(0, 25)); // Shorter trail for "faster" disappearance
        lastPos.current = { x, y };
      }

      // Decay points (remove points older than 300ms)
      setPoints(prev => prev.filter(p => now - p.age < 350));
      
      requestAnimationFrame(updateTrail);
    };

    const raf = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(raf);
  }, [mouseX, mouseY]);

  return (
    <svg className="fixed inset-0 pointer-events-none z-[99] hidden lg:block overflow-visible">
      {points.map((point, i) => {
        if (i === points.length - 1) return null;
        const nextPoint = points[i + 1];
        
        // Faster opacity and width falloff for a more "organic" feel
        const progress = i / points.length;
        const opacity = Math.max(0, 0.7 * (1 - progress));
        const strokeWidth = Math.max(1, 4 * (1 - progress));
        
        return (
          <line
            key={point.id}
            x1={point.x}
            y1={point.y}
            x2={nextPoint.x}
            y2={nextPoint.y}
            stroke="#0022ff"
            strokeWidth={strokeWidth}
            strokeOpacity={opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
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
      className="relative h-screen w-full bg-[#E8E8E8] overflow-hidden selection:bg-[#0022ff] selection:text-white cursor-default font-sans flex flex-col"
    >
      <div className="noise-overlay" />
      
      {/* Fluid Trail Element */}
      <FluidTrail mouseX={mouseX} mouseY={mouseY} />

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
            src="/UGC-Landing-NINCH_Logo-1.svg" 
            alt="NINCH Logo" 
            className="h-[23px] md:h-8 w-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </header>

      {/* Hero Section Container */}
      <main className="relative h-full w-full flex flex-col items-center justify-center p-0 pt-16 md:pt-0">
        
        {/* Main 3D Floating Element (Your Image) */}
        <motion.div 
          className="absolute left-[-10%] md:left-[-2%] top-[5%] md:top-[10%] w-[60%] md:w-[45%] h-auto z-10 pointer-events-none"
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
            src="/FLOR_blanca-con_lineas.png" 
            alt="STAGE 3D Hub" 
            className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)] select-none opacity-50 lg:opacity-100"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Unified Content Block to be centered */}
        <div className="w-full flex flex-col items-center gap-6 lg:gap-8 z-40 -mt-8 md:mt-0">
          
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
                <h1 className="stage-title text-[#0022ff] font-[900] select-none whitespace-nowrap w-full">
                  Stage
                </h1>
                <h1 className="stage-title absolute inset-0 text-white -z-10 translate-x-1 translate-y-1 opacity-40 blur-[1px] select-none whitespace-nowrap w-full">
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
                <h2 className="text-[2.5rem] md:text-[3.8vw] leading-[0.95] heading-druk text-[#0022ff] uppercase text-center px-4 md:px-0">
                  El nuevo hub UGC de NINCH<sup>®</sup>
                </h2>
              </div>
              
              <div className="w-full mt-2">
                <p className="text-[22px] md:text-[26px] font-medium leading-[1.05] text-[#141414] opacity-90 text-center">
                  Somos expertos en conectar a <span className="font-bold">top brands</span> con <span className="font-bold">creadores</span> que hacen fit con sus productos, resultando en campañas que <span className="font-bold">conectan, convierten y escalan.</span>
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
              <h3 className="text-3xl lg:text-4xl font-black text-[#141414] group-hover:scale-105 transition-transform">¿Querés ser parte?</h3>
              <p className="text-[30px] lg:text-[50px] font-black uppercase text-[#0022ff] leading-none heading-druk">BE ON</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
              <motion.button 
                onMouseEnter={playHoverSound}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  rest: { backgroundColor: "#ffffff", color: "#141414" },
                  hover: { backgroundColor: "#0022ff", color: "#ffffff", scale: 1.05 },
                  tap: { scale: 0.95 }
                }}
                className="btn-primary text-xs h-[46px] px-10"
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
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  rest: { backgroundColor: "#ffffff", color: "#141414" },
                  hover: { backgroundColor: "#0022ff", color: "#ffffff", scale: 1.05 },
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



      {/* Background Ambience Layers */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-white rounded-full blur-[180px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#0022ff] rounded-full blur-[200px] opacity-10" />
      </div>
    </div>
  );
}
