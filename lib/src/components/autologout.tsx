"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const AutoLogout = ({ timeout = 10, warningTimeout = 3 }) => {
  const [isIdle, setIsIdle] = useState(false); // Status idle
  const [isWarningVisible, setIsWarningVisible] = useState(false); // Status untuk menampilkan warning
  const [username, setUsername] = useState(""); // Menyimpan nama pengguna
  const [countdown, setCountdown] = useState(warningTimeout); // Waktu countdown untuk logout otomatis setelah warning
  const router = useRouter();
  const timeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined); // Menggunakan useRef untuk menyimpan timeoutId
  const warningTimeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined); // Timeout untuk countdown warning

  // Fungsi untuk logout
  const logout = () => {
    // Hapus session_id dari localStorage dan lakukan logout
    localStorage.removeItem("session_id");
    router.push("/login");
  };

  // Fungsi untuk reset timer setiap kali ada aktivitas pengguna
  const resetIdleTimer = () => {
    clearTimeout(timeoutId.current); // Gunakan timeoutId yang disimpan di useRef
    clearTimeout(warningTimeoutId.current); // Hapus timeout warning
    setIsIdle(false); // Reset status idle
    setIsWarningVisible(false); // Reset visibility warning
    setCountdown(warningTimeout); // Reset countdown

    timeoutId.current = setTimeout(() => {
      setIsIdle(true); // Jika sudah waktunya idle, set status idle
      setIsWarningVisible(true); // Tampilkan warning dialog
      startCountdown(); // Mulai countdown untuk logout otomatis
    }, timeout * 60 * 1000); // Konversi menit ke milidetik
  };

  // Fungsi untuk mulai countdown
  const startCountdown = () => {
    warningTimeoutId.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(warningTimeoutId.current); // Hentikan countdown
          logout(); // Logout jika tidak ada aksi
        }
        return prev - 1;
      });
    }, 1000); // Setiap detik decrement countdown
  };

  // Ambil nama pengguna dari localStorage ketika komponen dimount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Set event listeners untuk mendeteksi aktivitas pengguna
    const events = [
      "mousemove",
      "keydown",
      "scroll",
      "click",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Menjalankan timeout pertama kali ketika komponen dimount
    resetIdleTimer();

    // Cleanup: Hapus event listener saat komponen unmount
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearTimeout(timeoutId.current); // Bersihkan timeout saat komponen unmount
      clearTimeout(warningTimeoutId.current); // Bersihkan warning countdown
    };
  }, []);

  // Fungsi untuk melanjutkan aktivitas (reset status idle dan countdown)
  const continueActivity = () => {
    resetIdleTimer();
  };

  // Fungsi untuk logout langsung
  const logoutImmediately = () => {
    logout();
  };

  return (
    <div>
      {isIdle ? (
        isWarningVisible ? (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <p className="text-lg mb-4">
                {username ? `${username},` : "Anda"} sudah tidak aktif selama lebih dari{" "}
                {timeout} menit. Apakah Anda masih melanjutkan aktivitas?
              </p>
              <p className="text-sm mb-4">Waktu tersisa: {countdown} detik</p>
              <div className="flex justify-between">
                <button
                  onClick={continueActivity}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
                >
                  Ya, lanjutkan
                </button>
                <button
                  onClick={logoutImmediately}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
                >
                  Tidak, logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl">
            {username ? `${username},` : "Anda"} sudah tidak aktif selama lebih dari{" "}
            {timeout} menit, sedang logout...
          </p>
        )
      ) : (
        <p className="text-center text-lg">
          {username ? `${username},` : "Silakan"} lanjutkan aktivitas Anda.
        </p>
      )}
    </div>
  );
};

export default AutoLogout;
