import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('clickable')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsHovering(true);
    const handleMouseUp = () => setIsHovering(false);

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Hide default cursor on interactive elements again just in case
    const style = document.createElement('style');
    style.innerHTML = `
      a, button, [role="button"] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.head.removeChild(style);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      >
        {/* Camera Viewfinder Borders */}
        {/* Top Left */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white opacity-80" />
        {/* Top Right */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white opacity-80" />
        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white opacity-80" />
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white opacity-80" />
        
        {/* Center Target Dot or Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-60" />
        
        {/* Focus lines on hover */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
        >
           <div className="w-[1px] h-2 bg-white absolute top-1" />
           <div className="w-[1px] h-2 bg-white absolute bottom-1" />
           <div className="w-2 h-[1px] bg-white absolute left-1" />
           <div className="w-2 h-[1px] bg-white absolute right-1" />
        </motion.div>
      </motion.div>
      
      {/* "REC" indicator text near cursor */}
      <motion.div 
        className="absolute -top-6 -right-12 flex items-center gap-1 overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: isHovering ? 'auto' : 0 }}
      >
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <span className="text-[8px] font-bold text-white uppercase tracking-widest">REC</span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
