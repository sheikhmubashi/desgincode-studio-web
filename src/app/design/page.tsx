import FadeTransition from "@/components/FadeTransition";
import Image from "next/image";
import Link from "next/link";

export default function DesignPage() {
 return (
  <FadeTransition>
   <main className="min-h-screen bg-[#C3D6D4] relative md:px-0 px-4">
    {/* Main Content */}
    <div className="flex flex-col items-center justify-center min-h-screen">
     {/* DESIGN CODE text */}
     {/* Logo at the top */}
     <div>
      <Link href="/">
       <Image
        src={"/logo.svg"}
        alt="logo"
        width={128}
        height={120}
        className="cursor-pointer"
       />
      </Link>
      <h1 className="text-2xl font-medium hidden text-black mb-8 tracking-wider leading-tight text-center">
       DESIGN CODE
      </h1>
     </div>
     {/* Enter Button */}
     <Link href="/navigation">
      <button className="group lg:w-[174px] md:text-lg cursor-pointer mt-10 bg-white border-0 relative min-w-40 py-2 border-black text-black overflow-hidden">
       <span className="relative z-10">Enter</span>
      </button>
     </Link>
    </div>
   </main>
  </FadeTransition>
 );
}
