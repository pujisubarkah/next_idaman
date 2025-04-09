import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.m_spg_tingkat_pendidikan.findMany({
        select: {
          tingpend_id: true,
          nm_tingpend: true,
        },
        orderBy: {
          tingpend_id: 'asc', // Sesuai permintaan: urut berdasarkan tingpend_id naik
        },
      });

      // Handle jika tingpend_id bertipe BigInt
      const serializedData = data.map((item) => ({
        tingpend_id: item.tingpend_id?.toString(),
        nm_tingpend: item.nm_tingpend,
      }));

      return res.status(200).json(serializedData);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
