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
     initial={{ opacity: 0 }}
     animate={{
      opacity: isScrambled ? 1 : 0,
     }}
     transition={{
      duration: 0.8,
      ease: "easeInOut",
     }}
     className="absolute left-6 top-6 z-20"
     style={{ pointerEvents: isScrambled ? "auto" : "none" }}
    >
     <Link href="#" onClick={handleLogoClick}>
      <div className="flex items-center gap-2 md:gap-10 cursor-pointer group">
       <div className="w-[60px] h-[60px]">
        <Image
         src={"/logo.svg"}
         alt="logo"
         width={60}
         height={60}
         className="w-full h-full object-contain"
        />
       </div>
       {isScrambled && (
        <span className="text-sm md:text-lg transition-colors duration-300 group-hover:text-gray-600 font-heading font-[300]">
         {"< Click"}
        </span>
       )}
      </div>
     </Link>
    </motion.div>

    {/* DESIGN CODE Text - appears after unscramble */}

    {/* Centered Logo - appears after unscramble */}
    {!isScrambled && (
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: "calc(50% - 97px)" }}
     >
      <div className="w-[128px] h-[120px]">
       <Image
        src={"/logo.svg"}
        alt="logo"
        width={128}
        height={120}
        className="w-full h-full object-contain"
       />
      </div>
     </motion.div>
    )}

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
