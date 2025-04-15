// pages/api/satuan-kerja/index.js
import Prisma from '../../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ================= GET =================
    if (req.method === 'GET') {
      const data = await Prisma.m_spg_satuan_kerja.findMany({
        select: {
          satuan_kerja_id: true,
          satuan_kerja_nama: true,
          siap_skpd_m_spg_unit_kerja: {
            select: {
              unit_kerja_level: true,
              unit_kerja_id: true,
              unit_kerja_nama: true,
              unit_kerja_parent: true,
              m_spg_jabatan: {
                select: {
                  jabatan_jenis: true,
                  jabatan_kelas: true,
                  jabatan_id: true,
                  jabatan_nama: true,
                },
                orderBy: [
                  { jabatan_jenis: 'asc' },
                  { jabatan_kelas: 'desc' },
                ],
              },
            },
            orderBy: [
              { unit_kerja_level: 'asc' },
              { unit_kerja_parent: 'asc' },
            ],
          },
        },
        where: {
          status: 1,
        },
        orderBy: {
          satuan_kerja_nama: 'asc',
        },
      });

      return res.status(200).json(data);
    }

    // ================= POST =================
    if (req.method === 'POST') {
      const { unit_kerja_id, jabatan_nama, jabatan_jenis, jabatan_kelas } = req.body;

      if (!unit_kerja_id || !jabatan_nama) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newJabatan = await Prisma.siap_skpd_m_spg_jabatan.create({
        data: {
          unit_kerja_id,
          jabatan_nama,
          jabatan_jenis: jabatan_jenis || 'Struktural', // default value
          jabatan_kelas: jabatan_kelas || 1, // default value
        },
      });

      return res.status(201).json(newJabatan);
    }

    // ================= DELETE =================
    if (req.method === 'DELETE') {
      const { jabatan_id } = req.body;

      if (!jabatan_id) {
        return res.status(400).json({ error: 'Missing jabatan_id' });
      }

      const deleted = await Prisma.siap_skpd_m_spg_jabatan.delete({
        where: {
          jabatan_id,
        },
      });

      return res.status(200).json({ message: 'Jabatan deleted', data: deleted });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
}
