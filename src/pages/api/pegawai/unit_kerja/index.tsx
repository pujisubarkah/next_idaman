// pages/api/pegawai.js
import { supabase } from '../../../../../lib/supabaseClient'; // Pastikan path benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { unit_kerja_id } = req.query; // Mengambil parameter unit_kerja_id dari query

    console.log('Request received at /api/pegawai'); // Debugging log

    // Validasi unit_kerja_id
    if (!unit_kerja_id) {
      return res.status(400).json({ error: 'unit_kerja_id is required' });
    }

    try {
      // Query ke Supabase dengan filter berdasarkan unit_kerja_id dan urutkan berdasarkan gol_id_akhir secara menurun
      const { data, error } = await supabase
        .schema('siap')
        .from('view_data_pegawai')
        .select('*')
        .eq('unit_kerja_id', unit_kerja_id) // Filter unit_kerja_id
        .order('gol_id_akhir', { ascending: false }); // Urutkan berdasarkan gol_id_akhir dari yang terbesar

      // Menangani error pada query
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: error.message });
      }

      // Mengembalikan data jika ditemukan
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No data found for the given unit_kerja_id' });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
