"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScrambleModuleProps {
 isScrambled: boolean;
 shrinkText?: boolean;
}

export default function ScrambleModule({
 isScrambled,
 shrinkText = false,
}: ScrambleModuleProps) {
 const word = "DESIGN CODE";
 const [letterSpacing, setLetterSpacing] = useState(50);
 const [isMobile, setIsMobile] = useState(false);

 useEffect(() => {
  const updateSpacing = () => {
   const mobile = window.innerWidth < 768;
   setIsMobile(mobile);
   // Use tighter spacing on mobile, original wider on desktop
   setLetterSpacing(mobile ? 28 : 60);
  };

  updateSpacing();
  window.addEventListener("resize", updateSpacing);
  return () => window.removeEventListener("resize", updateSpacing);
 }, []);

 // Generate random positions for scrambled state - responsive
 const getScrambledPosition = (index: number) => {
  // Mobile positions - tighter
  const mobilePositions = [
   { x: "-22vw", y: "-12vh", rotate: 0 }, // D
   { x: "15vw", y: "-10vh", rotate: 0 }, // E
   { x: "-24vw", y: "3vh", rotate: 0 }, // S
   { x: "12vw", y: "0vh", rotate: 0 }, // I
   { x: "-12vw", y: "-3vh", rotate: 0 }, // G
   { x: "8vw", y: "10vh", rotate: 0 }, // N
   {
    x: Math.random() * 400 - 200,
    y: Math.random() * 400 - 200,
    rotate: Math.random() * 360,
   }, // Space
   { x: "18vw", y: "6vh", rotate: 0 }, // C
   { x: "-22vw", y: "-5vh", rotate: 0 }, // O
   { x: "20vw", y: "16vh", rotate: 0 }, // D
   { x: "-8vw", y: "13vh", rotate: 0 }, // E
  ];

  // Desktop positions - original
  const desktopPositions = [
   { x: "-35.625vw", y: "-21vh", rotate: 0 }, // D
   { x: "21.25vw", y: "-21vh", rotate: 0 }, // E
   { x: "-35.625vw", y: "18.4vh", rotate: 0 }, // S
   { x: "7.5vw", y: "-3.3vh", rotate: 0 }, // I
   { x: "-24vw", y: "-4vh", rotate: 0 }, // G
   { x: "12.5vw", y: "25vh", rotate: 0 }, // N
   {
    x: Math.random() * 400 - 200,
    y: Math.random() * 400 - 200,
    rotate: Math.random() * 360,
   }, // Space
   { x: "-3.9vw", y: "8.4vh", rotate: 0 }, // C
   { x: "-35.625vw", y: "-8.2vh", rotate: 0 }, // O
   { x: "35.2vw", y: "41.8vh", rotate: 0 }, // D
   { x: "-12.58vw", y: "35.4vh", rotate: 0 }, // E
  ];

  return isMobile ? mobilePositions[index] : desktopPositions[index];
 };

 return (
  <div className="flex flex-col items-center justify-center min-h-screen">
   <div className="relative inset-0 flex items-center justify-center">
    {word.split("").map((letter, index) => (
     <motion.div
      key={index}
      className="absolute font-bold text-black"
      initial={getScrambledPosition(index)}
      animate={
       isScrambled
        ? getScrambledPosition(index)
        : {
           x: shrinkText
            ? (index - (word.length - 1) / 2) * 15
            : (index - (word.length - 1) / 2) * letterSpacing,
           y: 0,
           rotate: 0,
           fontSize: shrinkText ? "1.5rem" : isMobile ? "2rem" : "3.125rem",
          }
      }
      transition={{
       type: "spring",
       damping: 30,
       stiffness: 70,
       duration: 1.5,
      }}
      style={{
       fontSize: isScrambled ? (isMobile ? "2rem" : "3.125rem") : undefined,
      }}
     >
      {letter}
     </motion.div>
    ))}
   </div>
  </div>
 );
}
