"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "../../lib/supabaseClient"; // Adjusted path
import bcrypt from "bcryptjs"; // Import bcrypt
import '@fortawesome/fontawesome-free/css/all.min.css';
import Image from 'next/image';





const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Query ke tabel user
      const { data: user, error } = await supabase
        .schema('siap_skpd')
        .from("users")
        .select("*")
        .eq("username", username)
        .single(); // Mengambil data user tunggal sesuai username

      if (error || !user) {
        setErrorMessage("Username tidak ditemukan");
        return;
      }

      // Validasi password menggunakan bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Simpan nama user di localStorage
        const userData = { id: user.id, nama: user.nama };
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData)); // Menyimpan user ke localStorage
          const sessionId = `${user.id}-${new Date().getTime()}`; // Session ID unik
          localStorage.setItem("session_id", sessionId); // Menyimpan session ID ke localStorage
        }

        // Menambahkan log login ke tabel log_login
        const sessionId = `${user.id}-${new Date().getTime()}`; // Session ID unik
        const { error: logError } = await supabase
          .schema('siap_skpd')
          .from('log_login')
          .insert([
        {
          username: user.username,  // Menyimpan username yang login
          user_id: user.id,  // ID user
          time: new Date().toISOString(),  // Menyimpan waktu login
          ip: window.location.hostname,  // Atau IP yang lebih tepat
          session_id: sessionId,  // ID sesi yang unik
          user_agent: navigator.userAgent,  // Informasi user agent
        }
          ]);

        if (logError) {
          console.log("Error logging login:", JSON.stringify(logError));  // Mencetak error dalam format JSON
        } else {
          console.log("Login log inserted successfully:", {
        username: user.username,
        session_id: sessionId,
        time: new Date().toISOString(),
          });
        }

        // Membuat sesi dan mencatatnya ke tabel log_session
        const { error: sessionError } = await supabase
          .schema('siap_skpd')
          .from('log_session')
          .insert([{
        session_id: sessionId,
        user_agent: navigator.userAgent,
        first_ip: window.location.hostname,  // IP saat pertama login
        first_username: user.username,  // Username yang login pertama kali
        label: "login successful"  // Label untuk sesi login
          }]);

        if (sessionError) {
          console.error("Error logging session:", sessionError);
        }

        // Navigasi ke halaman dashboard setelah login berhasil
        router.push("/home");
      } else {
        setErrorMessage("Password salah");
      }
    } catch (err) {
      console.error(err);
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
          layout="fill"
        />
      </div>
    </div>
  );
};

export default Login;
