import prisma from '../../../../../lib/prisma'; // Pastikan path sesuai
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (method === 'GET') {
    try {
      const data = await prisma.m_spg_satuan_kerja.findUnique({
        where: {
          satuan_kerja_id: Number(id),
        },
      });

      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (method === 'POST') {
    try {
      const { satuan_kerja_nama, kode_skpd, status } = req.body;

      if (!satuan_kerja_nama || !kode_skpd || status === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const created = await prisma.m_spg_satuan_kerja.create({
        data: {
          satuan_kerja_nama,
          kode_skpd,
          status,
        },
      });

      return res.status(201).json(created);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else if (method === 'PUT') {
    try {
      const { satuan_kerja_nama, kode_skpd, status } = req.body;

      if (!satuan_kerja_nama || !kode_skpd || status === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const updated = await prisma.m_spg_satuan_kerja.update({
        where: {
          satuan_kerja_id: Number(id),
        },
        data: {
          satuan_kerja_nama,
          kode_skpd,
          status,
        },
      });

      return res.status(200).json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error updating data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
