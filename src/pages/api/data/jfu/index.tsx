import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  try {
    const jabatanData = await prisma.siap_skpd_m_spg_referensi_jf.findMany({
      select: {
        jf_nama: true,
        jf_skill: true,
        m_spg_jabatan: {
          select: {
            spg_pegawai: {
              where: {
                peg_nip: { not: null }, // optional filter, biar lebih aman
              },
              select: {
                peg_nama: true,
                peg_nip: true,
                satuan_kerja_id: true,
                m_spg_satuan_kerja: {
                  select: {
                    satuan_kerja_nama: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        // hanya ambil jika ada m_spg_jabatan yang punya spg_pegawai
        m_spg_jabatan: {
          some: {
            spg_pegawai: {
              some: {
                peg_nip: { not: null }, // bisa disesuaikan kondisi
              },
            },
          },
        },
      },
    });

    const cleanedData = jabatanData.map(item => {
      // flatten semua pegawai dari semua jabatan
      const allPegawai = item.m_spg_jabatan.flatMap(j => j.spg_pegawai || []);
      return {
        jf_nama: item.jf_nama,
        jf_skill: item.jf_skill,
        daftar_pegawai: allPegawai,
        jumlah_pegawai: allPegawai.length,
      };
    });

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
