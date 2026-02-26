import Image from "next/image";
import Link from "next/link";
import { getFooter } from "@/actions/getFooter";

export default async function Footer() {
  const data = await getFooter();

  // Map platform to icon filename
  const getIconFile = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "/facebook_icon.svg";
      case "instagram":
        return "/instagram_icon.svg";
      case "linkedin":
        return "/linkedin_icon.svg";
      case "twitter":
        return "/twitter_icon.svg";
      default:
        return "/facebook_icon.svg";
    }
  };

  return (
    <footer>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-20 py-4 md:py-0">

          {/* Social Links */}
          <div className="flex items-center gap-1 text-sm text-gray-400 order-2 md:order-1">
            {data?.socialLinks?.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={getIconFile(link.platform)}
                  alt={`${link.platform}_icon`}
                  width={40}
                  height={40}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                />
              </Link>
            ))}
          </div>

          {/* Copyright Text */}
          <div className="text-sm font-body text-[#898989] md:text-base order-1 md:order-2 mb-2 md:mb-0">
            {data?.copyright ?? "© 2026 Design Code Studio. All Rights Reserved"}
          </div>
        </div>
      </div>
    </footer>
  );
}