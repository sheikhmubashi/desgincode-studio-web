// app/navigation/page.js
import FadeTransition from "@/components/FadeTransition";
import Image from "next/image";
import Link from "next/link";

export default function NavigationPage() {
 const navItems = [
  { name: "NEWS", href: "/news" },
  { name: "ABOUT US", href: "/about-us" },
  { name: "ARCHITECTURE", href: "/architecture" },
  { name: "INTERIORS", href: "/interiors" },
  { name: "PEOPLE", href: "/people" },
  { name: "CONTACT US", href: "/contact-us" },
 ];

 return (
  <FadeTransition>
   <main className="min-h-screen bg-white relative max-w-7xl mx-auto">
    {/* Logo at the top left - adjusted positioning */}
    <div className="absolute top-6 left-4 z-10">
     <Link href="/">
      <Image src={"/logo.svg"} alt="logo" width={60} height={60} />
     </Link>
    </div>

    {/* Navigation Menu - Left aligned with less top padding */}
    <div className="flex flex-col pt-32 lg:pt-36 min-h-screen px-4 ">
     <nav className="space-y-0.5">
      {navItems.map((item, index) => (
       <Link key={index} href={item.href} className="group block">
        <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black cursor-pointer transition-colors duration-300 hover:text-[#C3D6D4]">
         {item.name}
        </span>
       </Link>
      ))}
     </nav>
    </div>
   </main>
  </FadeTransition>
 );
}
