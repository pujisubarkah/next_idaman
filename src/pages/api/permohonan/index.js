
import { supabase } from '../../../../lib/supabaseClient'; // Pastikan pathnya benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { status_id, searchQuery } = req.query;

    console.log('Request received at /api/permohonan'); // Log untuk debugging

    try {
      // Membangun query Supabase
      let query = supabase
        .schema('siap_skpd') // Pastikan nama skema benar
        .from('view_status_edit_pegawai') // Pastikan nama view benar
        .select('*');

      // Menambahkan filter jika diperlukan
      if (status_id) {
        query = query.eq('status_id', status_id);
      }

      if (searchQuery) {
        query = query.ilike('column_name', `%${searchQuery}%`);
      }

      // Eksekusi query tanpa paginasi
      const { data, error, count } = await query;

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

      // Mengembalikan semua data
      return res.status(200).json({
        data,
        totalItems: count || data.length,
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
