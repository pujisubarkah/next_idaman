// pages/api/pegawai.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { searchQuery, page = 1, itemsPerPage = 10, peg_id } = req.query;

    console.log('Request received at /api/pegawai');

    if (!peg_id) {
      return res.status(400).json({ error: 'peg_id is required' });
    }

    try {
      const pageNumber = parseInt(page);
      const limit = parseInt(itemsPerPage);
      const skip = (pageNumber - 1) * limit;

      const whereClause = {
        peg_id: peg_id,
        ...(searchQuery && {
          peg_nama: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        }),
      };

      const totalItems = await prisma.spg_pegawai.count({ where: whereClause });

      const data = await prisma.spg_pegawai.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: {
          peg_nama: 'asc',
        },
        include: {
          siap_skpd_m_spg_jabatan: true, // Include relasi ke m_spg_jabatan
        },
      });

      if (data.length === 0) {
        return res.status(404).json({ message: 'Data not found' });
      }

      return res.status(200).json({
        data,
        totalItems,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // ===== POST =====
  else if (req.method === 'POST') {
    const { peg_id, peg_nama, jabatan_id } = req.body;

    if (!peg_id || !peg_nama || !jabatan_id) {
      return res.status(400).json({
        error: 'peg_id, peg_nama, and jabatan_id are required',
      });
    }

    try {
      const newPegawai = await prisma.spg_pegawai.create({
        data: {
          peg_id,
          peg_nama,
          jabatan_id, // pastikan ini foreign key yang sesuai dengan Prisma model
        },
      });

      return res.status(201).json({
        message: 'Pegawai added successfully',
        data: newPegawai,
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // ===== METHOD NOT ALLOWED =====
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
