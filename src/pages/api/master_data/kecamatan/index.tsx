import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { kabupaten_id } = req.query;

    try {
      const data = await prisma.m_spg_kecamatan.findMany({
        where: kabupaten_id ? { kabupaten_id: Number(kabupaten_id) } : undefined,
        select: {
          kabupaten_id: true,
          kecamatan_id: true,
          kecamatan_nm: true
        }
      });

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
