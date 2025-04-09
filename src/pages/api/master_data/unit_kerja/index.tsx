import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Ambil semua satuan kerja beserta unit kerjanya
      const data = await prisma.m_spg_satuan_kerja.findMany({
        where: {
          NOT: {
            satuan_kerja_id: 99,
          },
        },
        select: {
          satuan_kerja_id: true,
          satuan_kerja_nama: true,
          m_spg_unit_kerja: {
            where: {
              NOT: {
                unit_kerja_id: 99,
              },
            },
            select: {
              unit_kerja_id: true,
              unit_kerja_nama: true,
              unit_kerja_parent: true,
              unit_kerja_level: true,
            },
            orderBy: {
              unit_kerja_level: 'asc',
            },
          },
        },
        orderBy: {
          satuan_kerja_id: 'asc',
        },
      });

      // Fungsi menyusun hirarki unit kerja
      const buildHierarchy = (units) => {
        const unitMap = {};

        units.forEach(unit => {
          unitMap[unit.unit_kerja_id] = { ...unit, children: [] };
        });

        const result: Array<{ unit_kerja_id: number; unit_kerja_nama: string; unit_kerja_parent: number | null; unit_kerja_level: number; children: any[] }> = [];

        units.forEach(unit => {
          if (unit.unit_kerja_parent) {
            const parent = unitMap[unit.unit_kerja_parent];
            if (parent) {
              parent.children.push(unitMap[unit.unit_kerja_id]);
            }
          } else {
            result.push(unitMap[unit.unit_kerja_id]);
          }
        });

        return result;
      };

      const structuredData = data.map((satuan) => ({
        satuan_kerja_id: satuan.satuan_kerja_id,
        satuan_kerja_nama: satuan.satuan_kerja_nama,
        units: buildHierarchy(satuan.m_spg_unit_kerja),
      }));

      return res.status(200).json(structuredData);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

