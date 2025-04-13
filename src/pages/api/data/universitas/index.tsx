import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const universitas = await prisma.m_spg_universitas.findMany({
        orderBy: {
          univ_nmpti: 'asc',
        },
      });

      return res.status(200).json(universitas);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { univ_nmpti, univ_kota } = req.body;

      if (!univ_nmpti || !univ_kota) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newUniversitas = await prisma.m_spg_universitas.create({
        data: {
          univ_nmpti,
          univ_kota,
        },
      });

      return res.status(201).json(newUniversitas);
    } catch (error) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
