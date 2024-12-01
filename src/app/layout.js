import localFont from "next/font/local";
import React, { Suspense } from "react";
import "./globals.css";
import Loadingspinner from "../components/LoadingSpinner"; // Pastikan path sesuai

// Font lokal
const poppins = localFont({
  src: "./fonts/Poppins-Regular.woff",
  variable: "--font-poppins",
  weight: "400",
});

export const metadata = {
  title: "IDAMAN LAN",
  description: "Sistem Informasi Sumber Daya Manusia",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Suspense fallback={<Loadingspinner />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
