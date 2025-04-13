import prisma from '../../../../lib/prisma'; // Sesuaikan path jika perlu

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Mengambil data dari siap_skpd_spg_pensiun dan menghubungkannya dengan siap_skpd_spg_pegawai
      const spgPensiun = await prisma.siap_skpd_spg_pensiun.findMany({
        select: {
          rpensiun_id: true,
          pensiun_id: true,
          peg_id: true,
          rpensiun_tglsk: true, // Mengambil tanggal pensiun
          spg_pegawai: { // Menghubungkan dengan model siap_skpd_spg_pegawai
            select: {
              peg_nama: true, // Mengambil nama pegawai
              peg_lahir_tanggal: true, // Mengambil tanggal lahir
              peg_lahir_tempat: true, // Mengambil tempat lahir
              peg_nip: true, // Mengambil NIP pegawai
              peg_gol_akhir_tmt: true, // Mengambil golongan akhir TMT
              unit_kerja_id: true, // Mengambil ID unit kerja
              jabatan_id: true, // Mengambil ID jabatan
              peg_jabatan_tmt: true, // Mengambil TMT jabatan pegawai
              peg_status: true, // Mengambil status pegawai
              peg_ketstatus_tgl: true, // Mengambil tanggal status ket status
              peg_kerja_tahun: true, // Mengambil lama kerja dalam tahun
              peg_kerja_bulan: true, // Mengambil lama kerja dalam bulan
              peg_ketstatus: true, // Mengambil keterangan status
            },
          },
        },
      });

      // Mengonversi BigInt ke string untuk peg_id
      const responseData = spgPensiun.map(item => ({
        ...item,
        peg_id: item.peg_id ? item.peg_id.toString() : null, // Mengonversi BigInt menjadi String
        peg_nama: item.spg_pegawai?.peg_nama || null, // Menambahkan nama pegawai
        peg_lahir_tanggal: item.spg_pegawai?.peg_lahir_tanggal || null, // Menambahkan tanggal lahir
        peg_lahir_tempat: item.spg_pegawai?.peg_lahir_tempat || null, // Menambahkan tempat lahir
        peg_nip: item.spg_pegawai?.peg_nip || null, // Menambahkan NIP
        peg_gol_akhir_tmt: item.spg_pegawai?.peg_gol_akhir_tmt || null, // Menambahkan golongan akhir TMT
        unit_kerja_id: item.spg_pegawai?.unit_kerja_id || null, // Menambahkan ID unit kerja
        jabatan_id: item.spg_pegawai?.jabatan_id || null, // Menambahkan ID jabatan
        peg_jabatan_tmt: item.spg_pegawai?.peg_jabatan_tmt || null, // Menambahkan TMT jabatan
        peg_status: item.spg_pegawai?.peg_status || null, // Menambahkan status pegawai
        peg_ketstatus_tgl: item.spg_pegawai?.peg_ketstatus_tgl || null, // Menambahkan tanggal status
        peg_kerja_tahun: item.spg_pegawai?.peg_kerja_tahun || null, // Menambahkan tahun kerja
        peg_kerja_bulan: item.spg_pegawai?.peg_kerja_bulan || null, // Menambahkan bulan kerja
        peg_ketstatus: item.spg_pegawai?.peg_ketstatus || null, // Menambahkan keterangan status
      }));

      // Mengembalikan data jika berhasil
      res.status(200).json(responseData);
    } catch (error) {
      // Menangani jika terjadi error saat mengambil data
      console.error("Error details:", error);  // Menampilkan error lengkap
      res.status(500).json({ error: 'Error fetching spg_pensiun records' });
    }
  } else {
    // Menangani jika method yang digunakan bukan GET
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

