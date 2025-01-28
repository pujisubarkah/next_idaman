"use client";

import React, { useState } from "react";
import axios from "axios";
import RootLayout from "../../pegawai/profile/edit/layout";

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [strengthMessage, setStrengthMessage] = useState("");

    const validatePasswordStrength = (password: string) => {
        const minLength = /.{8,}/;
        const hasNumber = /[0-9]/;
        const hasUppercase = /[A-Z]/;
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

        let strength = 0;
        if (minLength.test(password)) strength++;
        if (hasNumber.test(password)) strength++;
        if (hasUppercase.test(password)) strength++;
        if (hasSymbol.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                return "Password terlalu lemah";
            case 2:
                return "Password kurang kuat";
            case 3:
                return "Password cukup kuat";
            case 4:
                return "Password sangat kuat";
            default:
                return "";
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            setMessage("Password baru dan konfirmasi tidak cocok.");
            return;
        }
    
        try {
            // Retrieve user data from localStorage
            const userData = localStorage.getItem("user"); // Replace "userData" with the actual key if different
            let username = "";
    
            if (userData) {
                const parsedData = JSON.parse(userData); // Parse the JSON string
                username = parsedData.username; // Get the username
            } else {
                setMessage("User data tidak ditemukan di localStorage.");
                return;
            }
    
            console.log("Sending request with username:", username); // Debugging line
    
            // Proceed to change the password
            const response = await axios.post("/api/users/ganti", {
                username,
                oldPassword,
                newPassword,
            });
    
            if (response.status === 200) {
                setMessage("Password berhasil diubah!");
            } else {
                setMessage(response.data.message || "Gagal mengubah password.");
            }
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Terjadi kesalahan.");
        }
    };
    
    

    return (
        <RootLayout>
            <div className="w-full max-w-sm mx-auto mt-10 p-5 bg-white shadow-md rounded">
                <h2 className="text-lg font-bold mb-4">Ubah Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Password Lama</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Password Baru</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setStrengthMessage(validatePasswordStrength(e.target.value));
                            }}
                            required
                        />
                        {strengthMessage && (
                            <p
                                className={`mt-2 text-sm ${
                                    strengthMessage === "Password sangat kuat"
                                        ? "text-green-600"
                                        : strengthMessage === "Password cukup kuat"
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                }`}
                            >
                                {strengthMessage}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-[#3781c7] text-white rounded hover:bg-[#2a5a8c]"
                    >
                        Ubah Password
                    </button>
                </form>
                {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
            </div>
        </RootLayout>
    );
};

export default ChangePassword;
