import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.m_status_kawin.findMany({
        select: {
          id_kawin: true,
          status: true,
        },
      });

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
