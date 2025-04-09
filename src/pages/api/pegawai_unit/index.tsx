// pages/api/pegawai.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function sanitizeBigInt(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeBigInt);
  } else if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'bigint') {
        sanitized[key] = value.toString();
      } else {
        sanitized[key] = sanitizeBigInt(value);
      }
    }
    return sanitized;
  }
  return obj;
}


export default async function handler(req, res) {
 if (req.method === 'GET') {
  const { searchQuery, page = 1, itemsPerPage = 10, peg_id } = req.query;

  if (!peg_id) {
    return res.status(400).json({ error: 'peg_id is required' });
  }

  try {
    const pageNumber = parseInt(page);
    const limit = parseInt(itemsPerPage);
    const skip = (pageNumber - 1) * limit;

    const whereClause = {
      peg_id: BigInt(peg_id),
      ...(searchQuery && {
        peg_nama: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
    };

    const totalItems = await prisma.siap_skpd_spg_pegawai.count({ where: whereClause });

    const data = await prisma.siap_skpd_spg_pegawai.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { peg_nama: 'asc' },
      include: {
        m_spg_jabatan: true,
      },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    const sanitized = sanitizeBigInt(data);

return res.status(200).json({
  data: sanitized,
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
    const newPegawai = await prisma.siap_skpd_spg_pegawai.create({
      data: {
        peg_id: BigInt(peg_id),
        peg_nama,
        jabatan_id,
      },
    });

    const sanitizedData = sanitizeBigInt(newPegawai);

return res.status(201).json({
  message: 'Pegawai added successfully',
  data: sanitizedData,
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
