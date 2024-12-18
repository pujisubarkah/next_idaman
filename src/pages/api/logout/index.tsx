import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  // Pastikan metode POST (bukan GET)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id } = req.body; // Ambil session_id dari body

  // Validasi session_id
  if (!session_id) {
    return res.status(400).json({ error: "Session ID harus disertakan" });
  }

  try {
    // Menambahkan header Cache-Control
    res.setHeader('Cache-Control', 'no-store');

    // Update data logout pada log_session
    const { data, error } = await supabase
      .schema("siap_skpd")
      .from("log_session")
      .update({
        logout_time: new Date().toISOString(), // Set waktu logout saat ini
      })
      .eq("session_id", session_id);

    // Tangani error atau jika session tidak ditemukan
    if (error) {
      return res.status(500).json({ error: "Gagal melakukan update logout_time" });
    }

    // Kembalikan response sukses logout
    return res.status(200).json({ message: "Logout berhasil", data });
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
}
