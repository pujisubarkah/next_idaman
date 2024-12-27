"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Logout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const sessionId = localStorage.getItem("session_id");

        if (!sessionId) {
          console.error("Session ID tidak ditemukan. Mengarahkan ke halaman login.");
          router.push("/login");
          return;
        }

        // Panggil API logout
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }), // Kirim sessionId ke API
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error dari API logout:", errorData.error);
          return;
        }

        // Hapus session ID dari localStorage setelah logout berhasil
        localStorage.removeItem("session_id");

        // Redirect ke halaman survey setelah logout berhasil
        router.push("/survey"); // Ganti dengan URL halaman survey Anda

        // Setelah beberapa detik, arahkan ke halaman login
        setTimeout(() => {
          router.push("/login");
        }, 5000); // Waktu tunggu 5 detik sebelum ke login
      } catch (err) {
        console.error("Terjadi kesalahan saat logout:", err);
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="p-4 bg-white shadow-md rounded">
        <h2 className="text-xl font-bold">Sedang keluar...</h2>
        <p>Sebelum logout, anda akan diarahkan ke halaman survey, berikan saran anda terhadap pengembangan aplikasi ini</p>
        <p>saran anda sangat penting bagi kami </p>
      </div>
    </div>
  );
};

export default Logout;
