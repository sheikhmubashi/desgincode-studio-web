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
   // Wider spacing on mobile for better readability
   setLetterSpacing(mobile ? 45 : 60);
  };

  updateSpacing();
  window.addEventListener("resize", updateSpacing);
  return () => window.removeEventListener("resize", updateSpacing);
 }, []);

 // Generate random positions for scrambled state - responsive
 const getScrambledPosition = (index: number) => {
  // Mobile positions - wider spacing
  const mobilePositions = [
   { x: "-30vw", y: "-18vh", rotate: 0 }, // D
   { x: "25vw", y: "-15vh", rotate: 0 }, // E
   { x: "-32vw", y: "5vh", rotate: 0 }, // S
   { x: "20vw", y: "2vh", rotate: 0 }, // I
   { x: "-18vw", y: "-5vh", rotate: 0 }, // G
   { x: "15vw", y: "15vh", rotate: 0 }, // N
   {
    x: Math.random() * 400 - 200,
    y: Math.random() * 400 - 200,
    rotate: Math.random() * 360,
   }, // Space
   { x: "28vw", y: "10vh", rotate: 0 }, // C
   { x: "-30vw", y: "-8vh", rotate: 0 }, // O
   { x: "30vw", y: "22vh", rotate: 0 }, // D
   { x: "-15vw", y: "20vh", rotate: 0 }, // E
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
  <div className="flex flex-col items-center justify-center h-full w-full">
   <div className="relative flex items-center justify-center">
    {word.split("").map((letter, index) => (
     <motion.div
      key={index}
      className="absolute font-bold text-black z-10"
      initial={getScrambledPosition(index)}
      animate={
       isScrambled
        ? getScrambledPosition(index)
        : {
           x: shrinkText
            ? (index - (word.length - 1) / 2) * 15
            : (index - (word.length - 1) / 2) * letterSpacing,
           y: shrinkText ? 40 : 0,
           rotate: 0,
           fontSize: shrinkText ? "1.5rem" : isMobile ? "2rem" : "3.125rem",
          }
      }
      whileHover={{ scale: 1.5 }}
      transition={{
       type: "spring",
       damping: 20,
       stiffness: 300,
       duration: 0.05,
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
