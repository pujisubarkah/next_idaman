"use client";

import React, { useEffect, useState } from "react";
import { FaBell, FaPowerOff } from "react-icons/fa";
import { BrowserRouter as Router, useNavigate } from "react-router-dom"; // Import useNavigate dan Router untuk navigasi
import { supabase } from "../../lib/supabaseClient"; // Adjusted path

const NavbarComponent = () => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        // Ambil data user dari localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.nama) {
            setUserName(user.nama); // Pastikan nama ada di dalam data user
        }
    }, []);

    const handleLogout = async () => {
        try {
            // Ambil user_id dan session_id dari localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            const sessionId = localStorage.getItem("session_id"); // Ambil session_id

            if (userData && sessionId) {
                const { nama } = userData;
                
                // Update log_session dengan deleted_at saat logout (menandakan sesi berakhir)
                const { error } = await supabase
                    .schema('siap_skpd')
                    .from('log_session')
                    .update({ deleted_at: new Date() }) // Waktu logout
                    .eq('session_id', sessionId) // Mencocokkan session_id
                    .eq('first_username', nama) // Mencocokkan username pertama
                    .isNull('deleted_at'); // Hanya update sesi yang belum memiliki deleted_at

                if (error) {
                    console.error("Error updating session:", error);
                }
            }

            // Hapus data user dan session_id dari localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("session_id");

            // Redirect ke halaman login setelah logout
            navigate("/login"); // Navigasi ke halaman login
        } catch (err) {
            console.error("Logout failed:", err);
        }
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

const Navbar = () => (
    <Router>
        <NavbarComponent />
    </Router>
);

export default Navbar;