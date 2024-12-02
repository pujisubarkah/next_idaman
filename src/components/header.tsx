import React from "react";
import Image from "next/image";

const ScrollingText = ({ text, className }) => {
  return (
    <div className="whitespace-nowrap overflow-hidden relative">
      <p className={`animate-marquee inline-block ${className}`}>
        {text}
      </p>
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
      <div className="relative z-10 flex flex-wrap items-center justify-between space-y-4 md:space-y-0">
        {/* Logo LAN */}
        <Image
          src="/lanp.png"
          alt="Logo LAN"
          className="h-auto"
          width={150}
          height={150}
          priority
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
            width={150}
            height={150}
            className="h-auto"
          />
          <Image
            src="/EVP.png"
            alt="Logo EVP"
            width={150}
            height={150}
            className="h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
