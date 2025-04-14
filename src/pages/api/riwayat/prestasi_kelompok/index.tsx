import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { peg_id } = req.query;

  try {
    if (req.method === 'GET') {
      if (!peg_id) {
        return res.status(400).json({ error: "'peg_id' parameter is required" });
      }

      const data = await prisma.spg_riwayat_prestasi_kelompok.findMany({
        where: {
          peg_id: BigInt(peg_id),
        },
      });

      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No data found for the given peg_id" });
      }

      const cleanData = JSON.parse(JSON.stringify(data, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
      ));

      return res.status(200).json(cleanData);
    }

    if (req.method === 'POST') {
      const {
        peg_id,
        nama_penghargaan,
        tahun,
        peran,
        tingkat,
        instansi_pemberi,
      } = req.body;

      if (!peg_id || !nama_penghargaan) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newData = await prisma.spg_riwayat_prestasi_kelompok.create({
        data: {
          peg_id: BigInt(peg_id),
          nama_penghargaan,
          tahun,
          peran,
          tingkat,
          instansi_pemberi,
        },
      });

      const cleanData = JSON.parse(JSON.stringify(newData, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
      ));

      return res.status(201).json({
        message: "Data successfully added",
        data: cleanData,
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: error.message });
  }
}
