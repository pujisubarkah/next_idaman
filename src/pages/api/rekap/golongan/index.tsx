import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ambil semua satuan kerja dan pegawainya
      const satuanKerjaData = await prisma.m_spg_satuan_kerja.findMany({
        select: {
          satuan_kerja_id: true,
          satuan_kerja_nama: true,
          v_pegawai_data: {
            select: {
              peg_nama: true,
              peg_nip: true,
              satuan_kerja_id: true,
              unit_kerja_id: true,
              satuan_kerja_nama: true, // jika ini disimpan di tabel pegawai
              unit_kerja_parent_nama: true,
              unit_kerja_nama: true,
              gol_id_akhir: true,
              jabatan_nama: true,
            },
          },
        },
      });

      // Ambil data golongan untuk mapping
      const golonganData = await prisma.m_spg_golongan.findMany({
        select: {
          gol_id: true,
          nm_gol: true,
        },
      });

      const golonganMap = golonganData.reduce((map, item) => {
        map[item.gol_id] = item.nm_gol;
        return map;
      }, {});

      const result = satuanKerjaData.map((satuanKerja) => {
        const golonganDetails = {};

        satuanKerja.v_pegawai_data.forEach((pegawai) => {
          const golName = golonganMap[pegawai.gol_id_akhir] || 'Unknown';

          if (!golonganDetails[golName]) {
            golonganDetails[golName] = {
              total: 0,
              pegawai: [],
            };
          }

          golonganDetails[golName].total += 1;
          golonganDetails[golName].pegawai.push({
            peg_nama: pegawai.peg_nama,
            peg_nip: pegawai.peg_nip,
            satuan_kerja_id: pegawai.satuan_kerja_id,
            unit_kerja_id: pegawai.unit_kerja_id,
            satuan_kerja_nama: pegawai.satuan_kerja_nama,
            unit_kerja_parent_nama: pegawai.unit_kerja_parent_nama,
            unit_kerja_nama: pegawai.unit_kerja_nama,
            gol_id_akhir: pegawai.gol_id_akhir,
            jabatan_nama: pegawai.jabatan_nama,
          });
        });

        return {
          satuan_kerja_id: satuanKerja.satuan_kerja_id,
          satuan_kerja_nama: satuanKerja.satuan_kerja_nama,
          golongan_details: golonganDetails,
        };
      });

      return res.status(200).json(result);
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: `Server Error: ${err.message}` });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
