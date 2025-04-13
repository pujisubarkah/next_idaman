import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { kecamatan_id } = req.query;

    // Validasi kecamatan_id wajib ada
    if (!kecamatan_id) {
      return res.status(400).json({ message: 'kecamatan_id is required' });
    }

    try {
      const data = await prisma.m_keldes.findMany({
        where: {
          kecamatan_id: Number(kecamatan_id), // kecamatan_id bukan bigint
        },
        select: {
          kecamatan_id: true,
          kelurahan_id: true, // ini bigint
          nama: true,
          kodepos: true,
        },
      });

      // Serialisasi BigInt (hanya kelurahan_id yang perlu)
      const serializedData = data.map((item) => ({
        id: item.kelurahan_id.toString(), // ubah ke string agar JSON tidak error
        kecamatan_id: item.kecamatan_id,
        nama: item.nama,
        kodepos: item.kodepos,
      }));

      return res.status(200).json(serializedData);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
