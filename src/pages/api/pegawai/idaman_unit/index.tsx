import { supabase } from '../../../../../lib/supabaseClient'; // Pastikan pathnya benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { pensiun_id, searchQuery, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pegawai'); // Log untuk debugging

    try {
      // Membangun query Supabase
      let query = supabase
        .schema('siap_skpd')
        .from('spg_pegawai')
        .select('*', { count: 'exact' });

      // Filter berdasarkan peg_status = true
      query = query.eq('peg_status', true);

      // Paginasi menggunakan range
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

      // Tambahkan URL base untuk peg_foto
      const basePhotoUrl = 'https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/';

      const updatedData = data.map(item => {
        return {
          ...item,
          peg_foto: item.peg_foto ? `${basePhotoUrl}${item.peg_foto}` : null, // Tambahkan URL foto jika ada
        };
      });

      // Mengembalikan data dengan informasi total
      return res.status(200).json({
        data: updatedData,
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
