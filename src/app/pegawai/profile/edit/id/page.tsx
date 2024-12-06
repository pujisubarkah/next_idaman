"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import RootLayout from '../../../../home/layout'; // Mengimpor layout dari home/layout.js
import UserNavbar from '../../../../home/user_navbar';
import Navbar2 from '../../../../home/navbar2';

const EditProfilePage = () => {
  const router = useRouter();
  const pathname = usePathname() || ''; // Mendapatkan path URL
  
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null); // State to manage errors

  // Mengambil username dari URL
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const usernameFromPath = pathSegments[pathSegments.length - 1]; // Ambil bagian terakhir sebagai username
    console.log('Username from path:', usernameFromPath); // Debug log

    if (usernameFromPath) {
      setUsername(usernameFromPath);
    } else {
      setError('Username not found in path');
      console.error('Username not found in path');
    }
  }, [pathname]);

  // Mengambil data username dari localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // Ubah kunci menjadi 'username'
    console.log('Stored username:', storedUsername); // Debug log

    if (storedUsername) {
      if (username && storedUsername !== username) {
        setError('You do not have permission to edit this profile');
        console.warn('You do not have permission to edit this profile');
      }
    } else {
      setError('Username not found in localStorage');
      console.error('Username not found in localStorage');
    }
  }, [username]);

  return (
    <RootLayout> {/* Wrap UserNavbar and Navbar2 with RootLayout */}
      <UserNavbar />
      <Navbar2 />
      <h1>Edit Profile</h1>
      {/* Render error message or form */}
      {error && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          <p>{error}</p>
        </div>
      )}
      {!error && (
        <div>
          {username && <p>Editing profile for: {username}</p>}
          {/* Render form atau komponen edit di sini */}
        </div>
      )}
    </RootLayout>
  );
};

export default EditProfilePage;
