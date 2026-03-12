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
 const [letterSpacing, setLetterSpacing] = useState(30);
 const [wordGap, setWordGap] = useState(60);
 const [isMobile, setIsMobile] = useState(false);

 useEffect(() => {
  const updateSpacing = () => {
   const mobile = window.innerWidth < 768;
   setIsMobile(mobile);
   // Adjusted letter spacing for even distribution in DESIGN
   setLetterSpacing(mobile ? 24 : 21);
   setWordGap(mobile ? 55 : 38);
  };

  updateSpacing();
  window.addEventListener("resize", updateSpacing);
  return () => window.removeEventListener("resize", updateSpacing);
 }, []);

 // Generate random positions for scrambled state - responsive
 const getScrambledPosition = (index: number) => {
  // Mobile positions - much wider spread
  const mobilePositions = [
   { x: "-38vw", y: "-22vh", rotate: 0 }, // D
   { x: "36vw", y: "-18vh", rotate: 0 }, // E
   { x: "-40vw", y: "12vh", rotate: 0 }, // S
   { x: "33vw", y: "5vh", rotate: 0 }, // I
   { x: "-22vw", y: "-8vh", rotate: 0 }, // G
   { x: "24vw", y: "22vh", rotate: 0 }, // N
   { x: "0vw", y: "-30vh", rotate: 0 }, // Space (hidden)
   { x: "38vw", y: "16vh", rotate: 0 }, // C
   { x: "-35vw", y: "-10vh", rotate: 0 }, // O
   { x: "40vw", y: "30vh", rotate: 0 }, // D
   { x: "-18vw", y: "28vh", rotate: 0 }, // E
  ];

  // Desktop positions - original
  const desktopPositions = [
   { x: "-35.625vw", y: "-21vh", rotate: 0 }, // D
   { x: "21.25vw", y: "-21vh", rotate: 0 }, // E
   { x: "-35.625vw", y: "18.4vh", rotate: 0 }, // S
   { x: "7.5vw", y: "-3.3vh", rotate: 0 }, // I
   { x: "-24vw", y: "-4vh", rotate: 0 }, // G
   { x: "12.5vw", y: "25vh", rotate: 0 }, // N
   { x: "0vw", y: "-40vh", rotate: 0 }, // Space (hidden)
   { x: "-3.9vw", y: "8.4vh", rotate: 0 }, // C
   { x: "-35.625vw", y: "-8.2vh", rotate: 0 }, // O
   { x: "35.2vw", y: "41.8vh", rotate: 0 }, // D
   { x: "-12.58vw", y: "35.4vh", rotate: 0 }, // E
  ];

  return isMobile ? mobilePositions[index] : desktopPositions[index];
 };

 // Get initial font size based on screen size
 const getInitialFontSize = () => {
  return isMobile ? "2.25rem" : "3.125rem";
 };

 // Calculate position with gap between DESIGN and CODE
 const getUnscrambledPosition = (index: number) => {
  // DESIGN = indices 0-5 (6 letters), Space = 6, CODE = indices 7-10 (4 letters)
  const spaceIndex = 6;

  // Hide the space character
  if (index === spaceIndex) {
   return 0;
  }

  let position;
  if (index < spaceIndex) {
   // DESIGN letters (0-5): center at -wordGap/2
   const designCenter = -wordGap / 2;
   position = designCenter + (index - 2.5) * letterSpacing;
  } else {
   // CODE letters (7-10): center at +wordGap/2
   const codeCenter = wordGap / 2;
   position = codeCenter + (index - spaceIndex - 2.5) * letterSpacing;
  }

  return position;
 };

 return (
  <div className="flex flex-col items-center justify-center min-h-screen gap-[118px]">
   {/* Text container - centered */}
   <div className="relative w-full h-[28px] flex items-center justify-center">
    {word.split("").map((letter, index) => (
     <motion.div
      key={index}
      className="absolute text-black z-10"
      style={{
       fontFamily: "Oswald, sans-serif",
       fontWeight: 500,
       letterSpacing: 0,
       opacity: letter === " " ? 0 : 1,
      }}
      initial={{
       ...getScrambledPosition(index),
       fontSize: getInitialFontSize(),
      }}
      animate={
       isScrambled
        ? {
           ...getScrambledPosition(index),
           fontSize: getInitialFontSize(),
          }
        : shrinkText
          ? {
             x: (index - (word.length - 1) / 2) * 15,
             y: 40,
             rotate: 0,
             fontSize: "1.5rem",
            }
          : {
             x: getUnscrambledPosition(index),
             y: 0,
             rotate: 0,
             fontSize: "1.1875rem", // 19px as per spec
            }
      }
      whileHover={isScrambled ? { scale: 1.1 } : undefined}
      transition={{
       type: "spring",
       damping: 70,
       stiffness: 150,
       mass: 0.9,
       restSpeed: 0.001,
       restDelta: 0.001,
      }}
     >
      {letter}
     </motion.div>
    ))}
   </div>

   {/* Button placeholder */}
  </div>
 );
}
