import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const agamaList = await prisma.m_spg_agama.findMany({
        orderBy: { id_agama: 'asc' },
        select: {
          id_agama: true,
          nm_agama: true,
        },
      })
      return res.status(200).json(agamaList)
    } catch (error: any) {
      return res.status(500).json({ error: 'Gagal mengambil data', detail: error.message })
    }
  }

  if (req.method === 'POST') {
    const { id_agama, nm_agama } = req.body

    try {
      const newAgama = await prisma.m_spg_agama.create({
        data: {
          id_agama,
          nm_agama,
        },
      })

      return res.status(201).json(newAgama)
    } catch (error: any) {
      return res.status(500).json({ error: 'Gagal menambah data', detail: error.message })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

