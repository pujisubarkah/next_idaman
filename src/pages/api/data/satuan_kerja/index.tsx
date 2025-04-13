import prisma from '../../../../../lib/prisma'; // Sesuaikan path jika perlu
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Ambil data dan urutkan berdasarkan satuan_kerja_nama
      const data = await prisma.m_spg_satuan_kerja.findMany({
        orderBy: {
          satuan_kerja_nama: 'asc',
        },
      });

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { satuan_kerja_nama, kode_skpd, status } = req.body;

      // Validasi input
      if (!satuan_kerja_nama || !kode_skpd || status === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Insert data menggunakan Prisma
      const created = await prisma.m_spg_satuan_kerja.create({
        data: {
          satuan_kerja_nama,
          kode_skpd,
          status,
        },
      });

      return res.status(201).json(created);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
