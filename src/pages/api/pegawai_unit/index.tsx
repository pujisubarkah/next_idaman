// pages/api/pegawai.js
import { supabase } from '../../../../lib/supabaseClient'; // Pastikan path benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { searchQuery, page = 1, itemsPerPage = 10, peg_id } = req.query;

    console.log('Request received at /api/pegawai'); // Log untuk debugging

    // Pastikan peg_id ada
    if (!peg_id) {
      return res.status(400).json({ error: 'peg_id is required' });
    }

    try {
      // Bangun query Supabase
      let query = supabase
        .schema('siap_skpd')
        .from('spg_pegawai')
        .select('*', { count: 'exact' })
        .eq('peg_id', peg_id); // Filter berdasarkan peg_id

      // Jika ada searchQuery, filter berdasarkan kolom tertentu (misalnya nama)
      if (searchQuery) {
        query = query.ilike('peg_nama', `%${searchQuery}%`); // Misalnya mencari pegawai berdasarkan nama
      }

      // Terapkan pagination menggunakan range
      const { data, error, count } = await query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      );

      // Tangani error dari Supabase
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: error.message });
      }

      // Jika tidak ada data ditemukan
      if (!data || data.length === 0) {
        console.log('No data found');
        return res.status(404).json({ message: 'Data not found' });
      }

      // Kembalikan data dengan total count
      return res.status(200).json({
        data,
        totalItems: count || 0,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    // Menangani permintaan POST untuk menambahkan pegawai baru
    const { peg_id, peg_nama, peg_jabatan } = req.body; // Ambil data dari body

    // Validasi input
    if (!peg_id || !peg_nama || !peg_jabatan) {
      return res.status(400).json({ error: 'peg_id, peg_nama, and peg_jabatan are required' });
    }

    try {
      // Tambahkan pegawai baru ke dalam tabel
      const { data, error } = await supabase
        .schema('siap_skpd')
        .from('spg_pegawai')
        .insert([{ peg_id, peg_nama, peg_jabatan }]);

      // Tangani error dari Supabase
      if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ error: error.message });
      }

      // Kembalikan data pegawai yang baru ditambahkan
      return res.status(201).json({
        message: 'Pegawai added successfully',
        data,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Jika method bukan GET atau POST, kembalikan 405 (Method Not Allowed)
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}