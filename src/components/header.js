import React from "react";
import Image from "next/image";

// Assuming you have a ScrollingText component, otherwise, you can create one.
const ScrollingText = ({ text, className }) => {
  return (
    <div className={`whitespace-nowrap overflow-hidden`}>
      <p className={`animate-marquee ${className}`}>{text}</p>
    </div>
  );
};

const Header = () => {
  return (
    <div
      className="relative bg-cover bg-center text-white p-6 mb-0"
      style={{
        backgroundImage:
          "url(https://lan.go.id/wp-content/uploads/2022/06/WhatsApp-Image-2022-06-24-at-13.43.42-1024x682.jpeg)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-teal-700 opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-wrap items-center justify-between">
        {/* Logo LAN */}
        <Image
          src="/lanp.png"
          alt="Logo LAN"
          className="h-20"
          width={80}
          height={80}
        />

        {/* Main Title */}
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold">
            Sistem Informasi Sumber Daya Manusia
          </h1>
          <p className="text-2xl mt-2">Lembaga Administrasi Negara</p>
        </div>

        {/* Additional Logos */}
        <div className="flex items-center space-x-4">
          <Image
            src="/berakhlak.png"
            alt="Logo Berakhlak"
            className="h-20"
            width={80}
            height={80}
          />
          <Image
            src="/EVP.png"
            alt="Logo EVP"
            className="h-20"
            width={80}
            height={80}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
