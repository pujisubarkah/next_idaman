"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RedirectToUsername = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchUsernameFromSession = async (sessionId) => {
      try {
        const response = await axios.get(`/api/log_session?session_id=${sessionId}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        return response.data.first_username; // Ambil first_username dari response
      } catch (error) {
        console.error("Error fetching username:", error);
        return null;
      }
    };

    const redirectToProfile = async () => {
      if (typeof window !== "undefined") {
        const sessionId = localStorage.getItem("session_id");

        if (!sessionId) {
          console.error("Invalid or missing Session ID");
          router.replace("/error");
          return;
        }

        const firstUsername = await fetchUsernameFromSession(sessionId);
        if (firstUsername) {
          router.push(`/pegawai/profile/edit/${firstUsername}`); // Redirect ke profile
        } else {
          console.error("first_username not found for session:", sessionId);
          router.replace("/error");
        }
      }
    };

    redirectToProfile();
  }, [router]);

  return null; // Tidak ada UI yang perlu ditampilkan
};

export default RedirectToUsername;