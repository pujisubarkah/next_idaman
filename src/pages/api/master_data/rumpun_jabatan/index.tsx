import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.m_spg_jabatan_rumpun.findMany({
        select: {
          rumpun_id: true,
          rumpun_nm: true,
        },
      });

      // Jika ada bigint di rumpun_id, serialize ke string
      const serializedData = data.map((item) => ({
        rumpun_id: item.rumpun_id?.toString(),
        rumpun_nm: item.rumpun_nm,
      }));

      return res.status(200).json(serializedData);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

