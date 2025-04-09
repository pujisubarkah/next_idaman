// pages/api/absen/index.ts
// pages/api/absen/index.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

type AbsenRequestBody = {
  tanggal?: string
  jam_masuk?: string
  jam_pulang?: string
  peg_id?: number | string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { tanggal, jam_masuk, jam_pulang, peg_id }: AbsenRequestBody = req.body

    try {
      const newAbsen = await prisma.absen_pegawai.create({
        data: {
          tanggal: tanggal ? new Date(tanggal) : null,
          jam_masuk: jam_masuk ? new Date(jam_masuk) : null,
          jam_pulang: jam_pulang ? new Date(jam_pulang) : null,
          peg_id: peg_id ? BigInt(peg_id) : null,
        },
      })

      return res.status(201).json({
        message: 'Absen berhasil ditambahkan',
        data: {
          ...newAbsen,
          absen_id: newAbsen.absen_id.toString(),
          peg_id: newAbsen.peg_id ? newAbsen.peg_id.toString() : null,
        },
      })
    } catch (error: any) {
      return res.status(500).json({
        error: 'Gagal menambahkan absen',
        detail: error.message,
      })
    }
  }

  if (req.method === 'GET') {
    try {
      const data = await prisma.absen_pegawai.findMany()

      const serializedData = data.map((item) => ({
        ...item,
        absen_id: item.absen_id.toString(),
        peg_id: item.peg_id ? item.peg_id.toString() : null,
      }))

      return res.status(200).json(serializedData)
    } catch (error: any) {
      return res.status(500).json({
        error: 'Gagal mengambil data absen',
        detail: error.message,
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
