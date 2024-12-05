"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const EditProfilePage = () => {
  const router = useRouter();
  const pathname = usePathname(); // Mendapatkan path URL
  const [username, setUsername] = useState(null);

  // Mengambil username dari URL
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const usernameFromPath = pathSegments[pathSegments.length - 1]; // Ambil bagian terakhir sebagai username
    console.log('Username from path:', usernameFromPath); // Debug log

    if (usernameFromPath) {
      setUsername(usernameFromPath);
    } else {
      console.error('Username not found in path');
      router.push('/login'); // Redirect ke halaman login jika tidak ada username di path
    }
  }, [pathname, router]);

  // Mengambil data username dari localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // Ubah kunci menjadi 'username'
    console.log('Stored username:', storedUsername); // Debug log

    if (storedUsername) {
      if (username && storedUsername !== username) {
        console.warn('You do not have permission to edit this profile');
        router.push('/'); // Redirect ke halaman aman jika username tidak cocok
      }
    } else {
      console.error('Username not found in localStorage');
      router.push('/login'); // Redirect ke halaman login jika tidak ada username di localStorage
    }
  }, [username, router]);

  return (
    <div>
      <h1>Edit Profile</h1>
      {/* Render form atau komponen edit di sini */}
      {username && <p>Editing profile for: {username}</p>}
    </div>
  );
};

export default EditProfilePage;
