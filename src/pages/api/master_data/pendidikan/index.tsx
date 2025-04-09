import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { kat_pend_id } = req.query;

    // Validasi: pastikan kat_pend_id dikirim
    if (!kat_pend_id) {
      return res.status(400).json({ message: 'kat_pend_id is required' });
    }

    try {
      const data = await prisma.m_spg_pendidikan.findMany({
        where: {
          kat_pend_id: Number(kat_pend_id), // Convert ke number jika tipe datanya numeric
        },
        select: {
          kat_pend_id: true,
          id_pend: true, // Misalnya ini bigint
          nm_pend: true,
        },
      });

      // Serialisasi bigint jika diperlukan
      const serializedData = data.map((item) => ({
        kat_pend_id: item.kat_pend_id,
        id_pend: item.id_pend?.toString(), // ubah BigInt ke string
        nm_pend: item.nm_pend,
      }));

      return res.status(200).json(serializedData);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
