"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RedirectToUsername = () => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Pastikan dijalankan di client
            const username = localStorage.getItem('username');
            if (username) {
                router.replace(`/pegawai/profile/edit/${username}`);
            } else {
                router.replace('/error'); // Atau halaman lain
            }
        }
    }, [router]);

    return null;
};

export default RedirectToUsername;
