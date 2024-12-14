import { supabase } from "../../../../lib/supabaseClient";
import bcrypt from "bcryptjs";

const fetchIpAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "Unknown IP";
  } catch (error) {
    console.error("Gagal mendapatkan IP Address:", error);
    return "Unknown IP";
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Kredensial harus diisi" });
  }

  try {
    // Cek jika ada sesi aktif sebelumnya untuk pengguna ini
    const { data: activeSession } = await supabase
      .schema("sipa_skpd")
      .from("log_session")
      .select("*")
      .eq("first_username", username)
      .eq("label", "login successful")
      .single();

    if (activeSession) {
      return res.status(400).json({ error: "Anda sudah login di sesi lain." });
    }

    const { data: user, error } = await supabase
      .schema("siap_skpd")
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (!user || error) {
      return res.status(401).json({ error: "Kredensial salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Kredensial salah" });
    }

    const sessionId = `${user.id}-${Date.now()}`;
    const ipAddress = await fetchIpAddress();
    const userAgent = req.headers["user-agent"] || "Unknown User Agent";

    // Catat log login
    await supabase
      .schema("sipa_skpd")
      .from("log_login")
      .insert([
        {
          username: user.username,
          user_id: user.id,
          time: new Date().toISOString(),
          ip: ipAddress,
          session_id: sessionId,
          user_agent: userAgent,
        },
      ]);

    // Catat sesi login
    await supabase
      .schema("sipa_skpd")
      .from("log_session")
      .insert([
        {
          session_id: sessionId,
          user_agent: userAgent,
          first_ip: ipAddress,
          first_username: user.username,
          label: "login successful",
        },
      ]);

    // Kirim data user
    return res.status(200).json({
      message: "Login berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role_id: user.role_id,
      },
      session_id: sessionId,
    });
  } catch (err) {
    console.error("Error saat login:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
}
