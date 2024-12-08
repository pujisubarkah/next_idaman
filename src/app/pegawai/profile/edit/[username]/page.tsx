"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RootLayout from '../../../../home/layout'; // Periksa apakah path ini benar
import Profile from '../../../../home/profile';

const EditProfile = ({ params }: { params: { username: string } }) => {
  const { username } = params; // Ambil parameter `username` dari URL
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Ambil data dari localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        // Parse JSON dan ambil username
        const parsedData = JSON.parse(userData);
        setStoredUsername(parsedData.username);

        // Redirect jika username dari localStorage tidak sama dengan parameter URL
        if (parsedData.username && parsedData.username !== username) {
          router.push(`/pegawai/profile/edit/${parsedData.username}`);
        }
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
      }
    }
  }, [username, router]);

  return (
    <RootLayout>
      <div>
       <Profile />
      </div>
    </RootLayout>
  );
};

export default EditProfile;
