
import { supabase } from '../../../../lib/supabaseClient'; // Pastikan pathnya benar

export default async function handler(req, res) {
  // Menangani hanya request GET
  if (req.method === 'GET') {
    const { pensiun_id, searchQuery, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pensiun'); // Log untuk debugging

    try {
      // Membangun query Supabase
      let query = supabase
        .schema('siap')
        .from('view_data_pegawai')
        .select('*');

      // Jika ada searchQuery, tambahkan filter
      if (searchQuery) {
        query = query.ilike('peg_nama_lengkap', `%${searchQuery}%`);
      }

      // Pastikan query.range dipanggil setelah semua kondisi query
      const { data, error, count } = await query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      );

      // Menangani error dari Supabase
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: error.message });
      }

      // Jika data tidak ditemukan
      if (!data || data.length === 0) {
        console.log('No data found');
        return res.status(404).json({ message: 'Data not found' });
      }

      // Mengembalikan data dengan informasi total
      return res.status(200).json({
        data,
        totalItems: count || 0,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Jika method yang digunakan selain GET, kembalikan status 405
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}