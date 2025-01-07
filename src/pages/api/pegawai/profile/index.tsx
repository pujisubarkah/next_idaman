import { supabase } from '../../../../../lib/supabaseClient'; // Pastikan path sudah benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { peg_id, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pegawai with query:', req.query); // Log untuk debugging

    // Validasi parameter
    if (peg_id && isNaN(Number(peg_id))) {
      return res.status(400).json({ error: 'ID pegawai tidak valid' });
    }

    // Parse `page` dan `itemsPerPage` menjadi angka
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1); // Minimal halaman 1
    const itemsPerPageNumber = Math.max(parseInt(itemsPerPage, 10) || 10, 1); // Minimal 1 item per halaman

    try {
      // Hitung offset untuk paginasi
      const offset = (pageNumber - 1) * itemsPerPageNumber;

      // Bangun query Supabase
      let query = supabase
      .schema('siap_skpd') // Sesuaikan jika skema yang digunakan bukan public
        .from('spg_pegawai')
        .select(
          'peg_nip, peg_nip_lama, peg_nama, peg_gelar_depan, peg_gelar_belakang, peg_foto',
          { count: 'exact' }
        )
        .range(offset, offset + itemsPerPageNumber - 1);

      // Tambahkan filter `peg_id` jika disediakan
      if (peg_id) {
        query = query.eq('peg_id', peg_id);
      }

      // Eksekusi query
      const { data, count, error } = await query;

      if (error) {
        console.error('Error Supabase:', error);
        return res
          .status(500)
          .json({ error: 'Terjadi kesalahan saat mengambil data pegawai' });
      }

      // Hitung total halaman
      const totalPages = Math.ceil((count || 0) / itemsPerPageNumber);

      // Kirim respons ke client
      return res.status(200).json({
        data,
        meta: {
          totalItems: count || 0,
          currentPage: pageNumber,
          totalPages,
          itemsPerPage: itemsPerPageNumber,
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  } else {
    // Penanganan untuk metode HTTP selain GET
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
