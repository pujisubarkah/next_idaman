import { supabase } from '../../../../../lib/supabaseClient'; // Pastikan pathnya benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { searchQuery, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pegawai'); // Log untuk debugging

    try {
      // Mendapatkan tanggal hari ini
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Hitung tanggal 4 tahun yang lalu
      const fourYearsAgo = new Date();
      fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);
      const fourYearsAgoDate = fourYearsAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Membangun query Supabase
      let query = supabase
        .schema('siap')
        .from('view_data_pegawai')
        .select('*', { count: 'exact' });

      // Filter berdasarkan peg_status = true (aktif)
      query = query.eq('peg_status', true);

      // Filter pegawai dengan peg_gol_akhir_tmt lebih dari 4 tahun yang lalu
      query = query.lte('peg_gol_akhir_tmt', fourYearsAgoDate);

      // Filter pegawai yang memiliki jfu_id (jfu_id tidak null)
      query = query.not('jfu_id', 'is', null);

      // Filter berdasarkan searchQuery jika ada
      if (searchQuery) {
        query = query.ilike('peg_nama_lengkap', `%${searchQuery}%`);
      }

      // Order berdasarkan abjad di peg_nama_lengkap
      query = query.order('peg_nama_lengkap', { ascending: true });

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
