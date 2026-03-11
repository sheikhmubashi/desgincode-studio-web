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
          top: "calc(50% - 150px)",
          x: "-50%",
          y: 0,
         }
     }
     transition={{
      type: "spring",
      damping: 30,
      stiffness: 70,
      duration: 1.5,
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
        transition={{ duration: 0.8, delay: 1.2 }}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute"
      style={{ top: "calc(50% + 80px)" }}
     >
      <Link href="/navigation">
       <button className="group lg:w-[174px] md:text-lg cursor-pointer bg-white border-0 relative min-w-40 py-2 border-black text-black overflow-hidden">
        <span className="relative z-10">Enter</span>
       </button>
      </Link>
     </motion.div>
    )}
   </div>
  </motion.main>
 );
}
