import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ambil sessionId dari body
    const { sessionId } = req.body; // Ambil langsung dari req.body
    console.log("Session ID Diterima:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID tidak ditemukan' });
    }

    // Logika penghapusan session
    await supabase
      .schema('siap_skpd')
      .from('log_session')
      .update({ logout_time: new Date() })
      .eq('session_id', sessionId);

    // Hapus session di cookies
    res.setHeader('Set-Cookie', 'session_id=; Max-Age=0; path=/');

    return res.status(200).json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error("Terjadi kesalahan saat logout:", error);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
