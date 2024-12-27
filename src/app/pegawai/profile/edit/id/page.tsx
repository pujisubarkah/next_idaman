

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RedirectToUsername = () => {
  const router = useRouter();

  useEffect(() => {
    let hasRedirected = false; // Cegah redirect berulang

    // Fungsi untuk mendapatkan first_username berdasarkan sessionId
    const fetchUsernameFromSession = async (sessionId: string) => {
      try {
        // Menambahkan header Cache-Control untuk mencegah caching
        const response = await axios.get(`/api/log_session?session_id=${sessionId}`, {
          headers: {
            'Cache-Control': 'no-cache', // Menambahkan header untuk mencegah cache
            'Pragma': 'no-cache',         // Untuk kompatibilitas dengan HTTP/1.0
            'Expires': '0'                // Pastikan tidak ada cache
          }
        });

        // Pastikan API memberikan first_username, bukan id
        return response.data.first_username; // Ini mengambil first_username yang dikembalikan dari API
      } catch (error) {
        if (error.response) {
          console.error(
            `API error: ${error.response.status} - ${error.response.statusText}`
          );
        } else if (error.request) {
          console.error("No response from API:", error.request);
        } else {
          console.error("Error fetching username:", error.message);
        }
        return null;
      }
    };

    // Fungsi untuk melakukan redirect ke halaman profile dengan first_username
    const redirectToProfile = async () => {
      if (hasRedirected) return; // Cegah eksekusi ulang
      hasRedirected = true;

      if (typeof window !== "undefined") {
        const sessionId = localStorage.getItem("session_id");

        // Validasi sessionId
        if (!sessionId || typeof sessionId !== "string") {
          console.error("Invalid or missing Session ID");
          router.replace("/error");
          return;
        }

        // Ambil first_username dari API berdasarkan sessionId
        const firstUsername = await fetchUsernameFromSession(sessionId);
        if (firstUsername) {
          router.replace(`/pegawai/profile/edit/${firstUsername}`); // Redirect menggunakan first_username
        } else {
          console.error("first_username not found for session:", sessionId);
          router.replace("/error");
        }
      }
    };

    redirectToProfile();
  }, [router]);

  return null;
};

export default RedirectToUsername;
