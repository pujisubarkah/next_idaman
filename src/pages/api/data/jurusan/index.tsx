import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const jurusanList = await prisma.m_spg_jurusan.findMany({
        orderBy: {
          jurusan_id: 'asc',
        },
      });

      return res.status(200).json(jurusanList);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { jurusan_nm } = req.body;

      if (!jurusan_nm) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newJurusan = await prisma.m_spg_jurusan.create({
        data: {
          jurusan_nm,
        },
      });

      return res.status(201).json(newJurusan);
    } catch (error) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
