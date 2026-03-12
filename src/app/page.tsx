"use client";

import ScrambleModule from "@/components/modules/scrambled";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
 const [isScrambled, setIsScrambled] = useState(true);
 const [showEnterButton, setShowEnterButton] = useState(false);

 const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  setIsScrambled(false);

  // Show Enter button after animations complete
  setTimeout(() => {
   setShowEnterButton(true);
  }, 2200);
 };

 return (
  <motion.main
   animate={{
    backgroundColor: !isScrambled ? "#C3D6D4" : "#ffffff",
   }}
   transition={{ duration: 1.2, delay: 0.3 }}
   className="min-h-screen overflow-hidden relative"
  >
   <div className="max-w-7xl mx-auto overflow-hidden relative min-h-screen flex items-center justify-center">
    {/* {!hideScramble && ( */}
    <ScrambleModule isScrambled={isScrambled} shrinkText={!isScrambled} />
    {/* )} */}

    {/* Logo */}
    <motion.div
     initial={false}
     animate={
      isScrambled
       ? {
          position: "absolute",
          left: "1.5rem",
          top: "1.5rem",
          x: 0,
          y: 0,
         }
       : {
          position: "absolute",
          left: "50%",
          top: "calc(50% - 100px)",
          x: "-50%",
          y: 0,
         }
     }
     transition={{
      type: "spring",
      damping: 70,
      stiffness: 150,
      mass: 0.9,
      restSpeed: 0.001,
      restDelta: 0.001,
     }}
     className="z-20"
    >
     <Link href="#" onClick={handleLogoClick}>
      <div className="flex items-center gap-2 md:gap-10 cursor-pointer group">
       <motion.div
        animate={{
         width: !isScrambled ? 128 : 60,
         height: !isScrambled ? 120 : 60,
        }}
        transition={{
         type: "spring",
         damping: 70,
         stiffness: 150,
         mass: 0.9,
         restSpeed: 0.001,
         restDelta: 0.001,
        }}
       >
        <Image
         src={"/logo.svg"}
         alt="logo"
         width={128}
         height={120}
         className="w-full h-full object-contain"
        />
       </motion.div>
       {isScrambled && (
        <span className="text-sm md:text-lg transition-colors duration-300 group-hover:text-gray-600 font-heading font-[300]">
         {"< Click"}
        </span>
       )}
      </div>
     </Link>
    </motion.div>

    {/* DESIGN CODE Text - appears after unscramble */}

    {/* Enter Button */}
    {showEnterButton && (
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: "calc(50% + 132px)" }}
     >
      <Link href="/navigation">
       <button className="group w-[174px] h-[40px] md:text-lg cursor-pointer bg-white border-0 relative text-black overflow-hidden">
        <span className="relative z-10">Enter</span>
       </button>
      </Link>
     </motion.div>
    )}
   </div>
  </motion.main>
 );
}
