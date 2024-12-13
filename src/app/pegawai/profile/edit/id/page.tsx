"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectToEditProfile = () => {
  const router = useRouter();

  useEffect(() => {
    // Mendapatkan 'username' dari localStorage
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      // Navigasi ke URL dengan username
      router.push(`/pegawai/profile/edit/${storedUsername}`);
    } else {
      console.error("Username tidak ditemukan di localStorage.");
    }
  }, [router]);

  return <div>Loading...</div>; // Bisa diganti dengan loading spinner
};

export default RedirectToEditProfile;
