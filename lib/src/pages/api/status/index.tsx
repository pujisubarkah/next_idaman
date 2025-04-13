import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ambil semua status dari m_status
      const statuses = await prisma.m_status.findMany({
        select: {
          id: true,
          status: true
        }
      });

      // Hitung jumlah untuk setiap status_id di status_edit_pegawai
      const statusesWithCount = await Promise.all(
        statuses.map(async (status) => {
          const count = await prisma.status_edit_pegawai.count({
            where: {
              status_id: status.id
            }
          });

          return {
            ...status,
            jumlah: count
          };
        })
      );

      res.status(200).json(statusesWithCount);
    } catch (error) {
      console.error('Server error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
