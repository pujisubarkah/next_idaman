"use client";
import React from "react";

// Import components
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/customsidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Wrapper to prevent overlap and set full screen */}
        <div className="flex flex-col h-screen">
          {/* Header */}
          <Header />

          {/* Navbar */}
          <Navbar />

          {/* Main Content with Sidebar */}
          <div className="flex flex-row flex-1">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
