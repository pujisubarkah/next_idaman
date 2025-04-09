import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = await prisma.m_spg_propinsi.findMany({
      select: {
        propinsi_id: true,
        propinsi_nm: true,
        m_spg_kabupaten: {
          select: {
            kabupaten_id: true,
            kabupaten_nm: true,
            m_spg_kecamatan: {
              select: {
                kecamatan_id: true,
                kecamatan_nm: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
}
