import localFont from "next/font/local";
import "./globals.css";



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
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
