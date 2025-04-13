import prisma  from "../../../../lib/prisma"; // Pastikan path-nya sesuai

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id } = req.query;

  console.log("Session ID yang diterima:", session_id);

  if (!session_id) {
    return res.status(400).json({ error: "Session ID harus disertakan" });
  }

  try {
    const sessionData = await prisma.log_session.findUnique({
      where: {
        session_id: session_id,
      },
      select: {
        first_username: true,
        user_agent: true,
        first_ip: true,
      },
    });

    if (!sessionData) {
      return res.status(404).json({ error: "Session tidak ditemukan" });
    }

    return res.status(200).json(sessionData);
  } catch (err) {
    console.error("Error saat memproses request:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
}
