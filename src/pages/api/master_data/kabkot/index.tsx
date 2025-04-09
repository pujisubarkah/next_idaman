import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { propinsi_id } = req.query;

    try {
      const data = await prisma.m_spg_kabupaten.findMany({
        where: propinsi_id
          ? { propinsi_id: Number(propinsi_id) }
          : undefined,
        select: {
          propinsi_id: true,
          kabupaten_id: true,
          kabupaten_nm: true,
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
