import { supabase } from "../../../../lib/supabaseClient"; // Pastikan path ini sesuai

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    try {
      // Perbarui log_session dengan waktu logout
      const { error } = await supabase
        .schema('siap_skpd') // Ganti dengan nama schema Anda 
        .from("log_session") // Nama tabel log session
        .update({
          logout_time: new Date().toISOString(), // Catat waktu logout
          label: "logout successful", // Ubah label
        })
        .eq("session_id", sessionId);

      if (error) {
        throw error;
      }

      res.status(200).json({ message: "Logout successful." });
    } catch (err) {
      console.error("Error saat logout:", err);
      res.status(500).json({ error: "Failed to logout." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
