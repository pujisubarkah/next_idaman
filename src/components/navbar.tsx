
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Gunakan useRouter untuk navigasi
import { FaBell, FaPowerOff } from "react-icons/fa";


const NavbarComponent = () => {
    const [userName, setUserName] = useState("");
    const router = useRouter(); // Gunakan useRouter untuk navigasi

    useEffect(() => {
        // Ambil data user dari localStorage
        if (typeof window !== "undefined") {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user && user.nama) {
                setUserName(user.nama); // Pastikan nama ada di dalam data user
            }
        }
    }, []);

    const handleLogout = () => {  
        // Redirect to the Logout component  
        router.push("/logout");  
    };

       

    return (
        <div className="flex justify-between items-center p-4 bg-[#333] text-white">
            {/* Left Section */}
            <div></div> {/* Empty to maintain spacing */}

            {/* Right Section */}
            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    title="Notifications"
                >
                    <FaBell className="mr-2" />
                </button>

                {/* Greeting */}
                {userName && (
                    <span className="font-medium">Selamat Datang, {userName}</span>
                )}

                {/* Logout Button */}
                <button
                    onClick={handleLogout} // Panggil handleLogout saat tombol diklik
                    className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    title="Logout"
                >
                    <FaPowerOff className="mr-2" />
                </button>
            </div>
        </div>
    );
};

export default NavbarComponent;
