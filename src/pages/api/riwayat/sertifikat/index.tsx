import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { peg_id } = req.query;

    if (!peg_id) {
      return res.status(400).json({ error: "'peg_id' parameter is required" });
    }

    const data = await prisma.siap_skpd_spg_riwayat_sertifikat.findMany({
      where: {
        peg_id: BigInt(peg_id), // ⚠️ gunakan BigInt jika peg_id memang besar
      },
      orderBy: {
        tanggal_sertifikat: 'asc',
      },
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found for the given peg_id" });
    }

    // Convert BigInt to string biar nggak error saat JSON.stringify
    const cleanData = JSON.parse(JSON.stringify(data, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: error.message });
  }
}
