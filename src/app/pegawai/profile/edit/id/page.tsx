// pages/pegawai/redirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectToEditProfile = () => {
  const router = useRouter();

  useEffect(() => {
    // Mendapatkan 'id' dari localStorage
    const storedId = localStorage.getItem("id");

    if (storedId) {
      // Navigasi ke URL dengan [nip]
      router.push(`/pegawai/profile/edit/${storedId}`);
    } else {
      console.error("ID tidak ditemukan di localStorage.");
    }
  }, [router]);

  return <div>Loading...</div>; // Bisa diganti dengan loading spinner
};

export default RedirectToEditProfile;
