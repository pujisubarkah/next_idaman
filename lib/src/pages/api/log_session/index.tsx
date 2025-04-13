import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Ambil session_id dari route parameter
  const { session_id } = req.query;

  console.log("Session ID yang diterima:", session_id);

  if (!session_id) {
    return res.status(400).json({ error: "Session ID harus disertakan" });
  }

  try {
    const { data, error } = await supabase
      .schema("siap_skpd")
      .from("log_session")
      .select("first_username, user_agent, first_ip")
      .eq("session_id", session_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Session tidak ditemukan" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error saat memproses request:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
}
