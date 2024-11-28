// pages/api/pegawai.js
import { supabase } from '../../../../lib/supabaseClient'; // Adjusted path

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { unit_kerja_id, searchQuery, peg_status } = req.query; // Ambil parameter query dari request

    try {
      let query = supabase
        .schema('siap')
        .from('view_data_pegawai')
        .select('*', { count: 'exact' })
        .order('peg_nama', { ascending: true });

      // Tambahkan filter peg_status jika ada
      if (peg_status !== undefined) {
        const status = peg_status === 'true'; // Ubah nilai peg_status ke boolean true/false
        query = query.eq('peg_status', status); // Filter peg_status
      }

      // Tambahkan filter pencarian jika ada
      if (searchQuery) {
        query = query.ilike('peg_nama_lengkap', `%${searchQuery}%`);
      }

      // Tambahkan filter unit_kerja_id jika ada
      if (unit_kerja_id) {
        query = query.eq('unit_kerja_id', unit_kerja_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data:", error.message);
        return res.status(500).json({ error: error.message });
      }

      // Mengubah peg_status menjadi 'Aktif' atau 'Tidak Aktif'
      const modifiedData = data.map(pegawai => ({
        ...pegawai,
        peg_status: pegawai.peg_status ? "Aktif" : "Tidak Aktif", // Mengubah boolean menjadi string 'Aktif' atau 'Tidak Aktif'
      }));

      res.status(200).json(modifiedData);
    } catch (error) {
      console.error("Server error:", error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Jika metode HTTP selain GET
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
