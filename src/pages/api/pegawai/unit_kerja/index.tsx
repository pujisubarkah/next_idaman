// pages/api/pegawai.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { unit_kerja_id } = req.query;

    console.log('Request received at /api/pegawai');

    if (!unit_kerja_id) {
      return res.status(400).json({ error: 'unit_kerja_id is required' });
    }

    try {
      // Query Prisma ke view_data_pegawai dengan filter dan urutan
      const data = await prisma.view_data_pegawai.findMany({
        where: {
          unit_kerja_id: parseInt(unit_kerja_id), // Pastikan sesuai tipe data (integer/string)
        },
        orderBy: {
          gol_id_akhir: 'desc',
        },
      });

      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No data found for the given unit_kerja_id' });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
