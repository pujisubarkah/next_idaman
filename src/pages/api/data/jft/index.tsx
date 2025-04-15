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
        // Ambil semua pegawai dari masing-masing jabatan, lalu gabung jadi satu array
        const allPegawai = item.m_spg_jabatan
          .flatMap(j => j.spg_pegawai || [])
          .filter(p => !!p); // filter null/undefined just in case

        if (allPegawai.length === 0) return null;

        return {
          jf_nama: item.jf_nama,
          jf_skill: item.jf_skill,
          m_spg_jabatan: allPegawai, // langsung isi daftar pegawai
          jumlah_pegawai: allPegawai.length,
        };
      })
      .filter(item => item !== null); // buang yang kosong

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
