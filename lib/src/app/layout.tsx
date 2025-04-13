import React, { Suspense } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Loadingspinner from '../components/LoadingSpinner'; // Ensure path is correct

// Import a local font
const poppins = localFont({
  src: './fonts/Poppins-Regular.woff',
  variable: '--font-poppins',
  weight: '400',
});

export const metadata = {
  title: 'IDAMAN LAN',
  description: 'Sistem Informasi Sumber Daya Manusia',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={poppins.variable}>
        <Suspense fallback={<Loadingspinner />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}

