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
    });

    const cleanedData = jabatanData
      .map(item => {
        // Filter hanya jabatan yang punya pegawai
        const filtered_jabatan = item.m_spg_jabatan.filter(j => (j.spg_pegawai || []).length > 0);
        const jumlah_pegawai = filtered_jabatan
          .reduce((total, j) => total + (j.spg_pegawai?.length || 0), 0);

        return {
          jf_nama: item.jf_nama,
          jf_skill: item.jf_skill,
          m_spg_jabatan: filtered_jabatan,
          jumlah_pegawai,
        };
      })
      .filter(item => item.m_spg_jabatan.length > 0); // Hapus item yang gak punya jabatan dengan pegawai

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
