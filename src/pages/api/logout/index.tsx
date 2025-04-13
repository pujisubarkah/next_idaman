import prisma  from "../../../../lib/prisma"; // sesuaikan path sesuai struktur project

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { sessionId } = req.body;

    console.log("Session ID Diterima:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID tidak ditemukan' });
    }

    // Update logout_time berdasarkan session_id
    const updateResult = await prisma.log_session.updateMany({
      where: {
        session_id: sessionId,
      },
      data: {
        logout_time: new Date(),
      },
    });

    // Jika tidak ada row yang diupdate, beri respon gagal
    if (updateResult.count === 0) {
      return res.status(404).json({ error: 'Session tidak ditemukan' });
    }

    // Hapus session_id dari cookie
    res.setHeader('Set-Cookie', 'session_id=; Max-Age=0; Path=/; HttpOnly');

    return res.status(200).json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error("Terjadi kesalahan saat logout:", error);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
