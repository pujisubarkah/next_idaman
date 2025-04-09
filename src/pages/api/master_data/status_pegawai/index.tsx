import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.jenis_pegawai.findMany({
        select: {
          status_kepegawaian_id: true,
          stspeg_nama: true,
        },
      });

      // Serialize jika ada BigInt
      const serializedData = data.map((item) => ({
        status_kepegawaian_id: item.status_kepegawaian_id?.toString(),
        stspeg_nama: item.stspeg_nama,
      }));

      return res.status(200).json(serializedData);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

