"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient"; // Adjusted path
import bcrypt from "bcryptjs"; // Import bcrypt
import '@fortawesome/fontawesome-free/css/all.min.css';
import Image from "next/image";

const fetchIpAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Gagal mendapatkan IP Address:", error);
    return "Unknown IP";
  }
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Username dan password harus diisi");
      return;
    }

    try {
      const { data: user, error } = await supabase
        .schema("siap_skpd") // Ganti dengan nama schema Anda
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !user) {
        setErrorMessage("Username tidak ditemukan");
        return;
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        const userData = { 
          id: user.id, 
          nama: user.nama, 
          role_id: user.role_id // Simpan role_id
        };
        const sessionId = `${user.id}-${new Date().getTime()}`; // Session ID unik

        // Simpan user dan session_id ke localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("session_id", sessionId);

        const ipAddress = await fetchIpAddress();

        // Tambahkan log login ke tabel log_login
        const { error: logError } = await supabase
          .schema("siap_skpd") // Ganti dengan nama schema Anda
          .from("log_login")
          .insert([
            {
              username: user.username,
              user_id: user.id,
              time: new Date().toISOString(),
              ip: ipAddress,
              session_id: sessionId,
              user_agent: navigator.userAgent,
            },
          ]);

        if (logError) console.error("Error logging login:", logError);

        // Catat sesi ke tabel log_session
        const { error: sessionError } = await supabase
          .schema("siap_skpd") // Ganti dengan nama schema Anda
          .from("log_session")
          .insert([
            {
              session_id: sessionId,
              user_agent: navigator.userAgent,
              first_ip: ipAddress,
              first_username: user.username,
              label: "login successful",
            },
          ]);

        if (sessionError) console.error("Error logging session:", sessionError);

        // Navigasi ke halaman dashboard
        // Cek role_id dan arahkan pengguna sesuai dengan peran mereka
        if (userData.role_id === 1) {
          // Admin
          router.push("/home");
        } else if (userData.role_id === 4) {
          // User
          router.push("/home");
        } else {
          setErrorMessage("Peran tidak dikenali");
        }
      } else {
        setErrorMessage("Password salah");
      }
    } catch (err) {
      console.error("Error saat login:", err);
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex h-screen m-0 p-0">
      <div className="w-1/4 flex flex-col justify-center items-center bg-white p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src="/lanri.png" alt="Logo LANRI" className="w-20 mb-4" width={80} height={80} />
          <h1 className="text-4xl font-bold mb-2 text-teal-600">IDAMAN LAN</h1>
          <p className="text-gray-600 text-center">
            Sistem Informasi Sumber Daya Manusia Lembaga Administrasi Negara
          </p>
        </div>
        <div className="w-full max-w-md">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <div className="mb-4">
              <div className="relative">
                <i className="fas fa-user absolute left-3 top-3 text-gray-500"></i>
                <input
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-3 text-gray-500"></i>
                <input
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} absolute right-3 top-3 text-gray-500 cursor-pointer`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-teal-600"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">Ingat saya?</span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-3/4 bg-gray-100 flex items-center justify-center m-0 p-0 relative">
        <Image
          src="/lan-ilustrasi.jpeg"
          alt="Illustration of Lembaga Administrasi Negara building with cartoon characters"
          className="h-full object-cover"
          fill
        />
      </div>
    </div>
  );
};

export default Login;
