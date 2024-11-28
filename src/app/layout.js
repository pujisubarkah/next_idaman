import localFont from "next/font/local";
import "./globals.css";

// Import komponen Header, Navbar, dan Sidebar
import Header from "../components/header";
import Sidebar from "../components/customsidebar";
import Navbar from "../components/navbar";

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

export default function RootLayout({ children }) {
  const role = "admin"; // Simulasi role, bisa diambil dari session atau context

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <Header />

          {/* Navbar */}
          <Navbar />

          {/* Layout dengan Sidebar */}
          <div className="flex flex-1">
            {/* Sidebar */}
            <Sidebar role={role} />

            {/* Konten utama */}
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
