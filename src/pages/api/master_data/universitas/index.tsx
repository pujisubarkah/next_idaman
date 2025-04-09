import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pageSize = 1000;
      const totalRows = await prisma.m_spg_universitas.count(); // Hitung total baris
      const totalPages = Math.ceil(totalRows / pageSize);
      let allData: { univ_id: number; univ_nmpti: string; univ_kota: string }[] = [];

      for (let page = 0; page < totalPages; page++) {
        const data = await prisma.m_spg_universitas.findMany({
          skip: page * pageSize,
          take: pageSize,
          select: {
            univ_id: true,
            univ_nmpti: true,
            univ_kota: true,
          },
        });
        allData = allData.concat(
          data.map(item => ({
            univ_id: item.univ_id,
            univ_nmpti: item.univ_nmpti || '',
            univ_kota: item.univ_kota || '',
          }))
        );
      }

      return res.status(200).json(allData);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { univ_nmpti, univ_kota } = req.body;

      if (!univ_nmpti || !univ_kota) {
        return res.status(400).json({ message: 'Missing required fields: univ_nmpti and univ_kota are required.' });
      }

      const newUniv = await prisma.m_spg_universitas.create({
        data: {
          univ_nmpti,
          univ_kota,
        },
        select: {
          univ_id: true,
          univ_nmpti: true,
          univ_kota: true,
        },
      });

      return res.status(201).json({ message: 'Data university added successfully', data: newUniv });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error adding university', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
