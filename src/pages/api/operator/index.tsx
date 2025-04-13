import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Ambil semua user dengan role_id = 1
      const users = await prisma.siap_skpd_users.findMany({
        where: { role_id: 1 },
        select: {
          username: true,
          nama: true,
        },
      });

      // Ambil semua action_log dalam rentang tahun 2024
      const actionLogs = await prisma.action_log.findMany({
        where: {
          time: {
            gte: new Date('2024-01-01T00:00:00Z'),
            lt: new Date('2025-01-01T00:00:00Z'),
          },
        },
        select: {
          username: true,
          aksi: true,
          entity_id: true,
          time: true,
        },
      });

      // Gabungkan data berdasarkan username
      const userMap: {
        [username: string]: {
          username: string;
          nama: string;
          count: number;
          actions: {
            aksi: string;
            entity_id: string;
            time: Date;
          }[];
        };
      } = {};

      users.forEach(user => {
        userMap[user.username] = {
          username: user.username,
          nama: user.nama ?? '',
          count: 0,
          actions: [],
        };
      });

      actionLogs.forEach(log => {
        if (log.username && userMap[log.username]) {
          userMap[log.username].count += 1;
          userMap[log.username].actions.push({
            aksi: log.aksi ?? '',
            entity_id: log.entity_id ?? '',
            time: log.time ?? new Date(0),
          });
        }
      });

      // Ubah hasil ke dalam array dan sort berdasarkan count
      const result = Object.values(userMap).sort((a, b) => b.count - a.count);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
