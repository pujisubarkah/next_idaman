import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all satuan kerja and their pegawai from Prisma
      const satuanKerjaData = await prisma.m_spg_satuan_kerja.findMany({
        include: {
          siap_skpd_spg_pegawai: {
            select: {
              peg_nama: true,
              peg_nip: true,
              satuan_kerja_id: true,
              unit_kerja_id: true,
              satuan_kerja_nama: true,
              unit_kerja_parent_nama: true,
              unit_kerja_nama: true,
              eselon_nm: true,
              jabatan_nama: true,
              peg_jenis_kelamin: true
            }
          }
        }
      });

      const groupedByGender = satuanKerjaData.map((satuanKerja) => {
        const groupedPegawai = satuanKerja.siap_skpd_spg_pegawai.reduce((acc, pegawai) => {
          const gender = pegawai.peg_jenis_kelamin || 'Tidak Diketahui';
          if (!acc[gender]) {
            acc[gender] = {
              count: 0,
              pegawai: []
            };
          }
          acc[gender].pegawai.push(pegawai);
          acc[gender].count += 1;
          return acc;
        }, {});

        return {
          satuan_kerja_id: satuanKerja.satuan_kerja_id,
          satuan_kerja_nama: satuanKerja.satuan_kerja_nama,
          pegawai_by_gender: groupedPegawai
        };
      });

      return res.status(200).json(groupedByGender);
    } catch (error) {
      console.error('Internal Server Error:', error);
      return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
