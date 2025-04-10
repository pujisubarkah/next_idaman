import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { pensiun_id, searchQuery, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pensiun');

    try {
      const pageNumber = parseInt(page);
      const limit = parseInt(itemsPerPage);
      const skip = (pageNumber - 1) * limit;

      // Bangun where clause dinamis
      const whereClause = {
        peg_status: false, // Filter status aktif/pensiun
        ...(pensiun_id && {
          pensiun_id: {
            in: pensiun_id.split(',').map(Number),
          },
        }),
        ...(searchQuery && {
          peg_nama_lengkap: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        }),
      };

      // Hitung total data
      const totalItems = await prisma.v_pegawai_data.count({
        where: whereClause,
      });

      // Ambil data dengan paginasi dan sorting
      const data = await prisma.v_pegawai_data.findMany({
        where: whereClause,
        orderBy: {
          peg_tmt_pensiun: 'desc',
        },
        skip,
        take: limit,
      });

      // Cek kalau datanya kosong
      if (!data || data.length === 0) {
        console.log('No data found');
        return res.status(404).json({ message: 'Data not found' });
      }

      // Ubah BigInt (kalau ada) ke string
      const sanitized = data.map((item) => {
        const clean = { ...item };
        for (const key in clean) {
          if (typeof clean[key] === 'bigint') {
            clean[key] = clean[key].toString();
          }
        }
        return clean;
      });

      // Kirim hasilnya
      return res.status(200).json({
        data: sanitized,
        totalItems,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
