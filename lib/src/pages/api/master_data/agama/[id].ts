import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { nm_agama } = req.body

    try {
      const updated = await prisma.m_spg_agama.update({
        where: { id_agama: Number(id) },
        data: { nm_agama },
      })

      return res.status(200).json(updated)
    } catch (error: any) {
      return res.status(500).json({ error: 'Gagal update data', detail: error.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.m_spg_agama.delete({
        where: { id_agama: Number(id) },
      })

      return res.status(200).json({ message: 'Data berhasil dihapus' })
    } catch (error: any) {
      return res.status(500).json({ error: 'Gagal hapus data', detail: error.message })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
