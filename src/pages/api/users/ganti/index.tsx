import { supabase } from "../../../../../lib/supabaseClient"; // Sesuaikan path
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, oldPassword, newPassword } = req.body;

  // Validasi input
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Semua data harus diisi" });
  }

  try {
    // 1. Ambil user dari database
    const { data: users, error } = await supabase
      .schema("siap_skpd")
      .from("users")
      .select("*")
      .eq("username", username);

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = users[0];

    // 2. Verifikasi password lama
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    // 3. Validasi password baru (opsional)
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password baru harus minimal 8 karakter" });
    }

    // 4. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password di database
    const { error: updateError } = await supabase
      .schema("siap_skpd")
      .from("users")
      .update({ password: hashedPassword })
      .eq("username", username);

    if (updateError) {
      console.error("Update error:", updateError);
      return res
        .status(500)
        .json({ message: "Gagal memperbarui password, coba lagi nanti" });
    }

    // Sukses
    res.status(200).json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}
