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
      .filter(item =>
        item.m_spg_jabatan?.some(j => (j.spg_pegawai || []).length > 0)
      )
      .map(item => {
        const jumlah_pegawai = item.m_spg_jabatan
          .flatMap(j => j.spg_pegawai || [])
          .length;

        return {
          ...item,
          jumlah_pegawai,
        };
      });

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
