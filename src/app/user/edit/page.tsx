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
            const response = await axios.post("/api/ganti", {
                username: "username_anda",
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
                        className="w-full p-2 bg-teal-600 text-white rounded hover:bg-teal-700"
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
