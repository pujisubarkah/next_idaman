import { supabase } from '../../../../lib/supabaseClient'; // Pastikan path sesuai dengan proyek Anda

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Mendapatkan ID dari URL parameter

  if (method === 'GET') {
    try {
      // Fetch data from Supabase sorted by satuan_kerja_nama
      const { data, error } = await supabase
        .schema('siap') // Pastikan nama schema benar
        .from('m_spg_satuan_kerja') // Pastikan nama tabel benar
        .select('*')
        .eq('satuan_kerja_id', id); // Menggunakan satuan_kerja_id sebagai filter

      if (error) throw error;

      return res.status(200).json(data); // Mengirimkan data yang ditemukan
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (method === 'POST') {
    try {
      const { satuan_kerja_nama, kode_skpd, status } = req.body;

      // Validasi input
      if (!satuan_kerja_nama || !kode_skpd || status === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Insert data into Supabase
      const { data, error } = await supabase
        .schema('siap') // Pastikan nama schema benar
        .from('m_spg_satuan_kerja') // Pastikan nama tabel benar
        .insert([{ satuan_kerja_nama, kode_skpd, status }]);

      if (error) throw error;

      return res.status(201).json(data); // Mengirimkan data yang baru dimasukkan
    } catch (error) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else if (method === 'PUT') {
    try {
      const { satuan_kerja_nama, kode_skpd, status } = req.body;

      // Validasi input
      if (!satuan_kerja_nama || !kode_skpd || status === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Pastikan hanya kolom yang ingin diupdate yang diteruskan
      const { data, error } = await supabase
        .schema('siap') // Pastikan nama schema benar
        .from('m_spg_satuan_kerja') // Pastikan nama tabel benar
        .update({ satuan_kerja_nama, kode_skpd, status })
        .eq('satuan_kerja_id', id); // Memperbarui data berdasarkan satuan_kerja_id yang diterima dari query

      if (error) throw error;

      // Mengirimkan data yang telah diperbarui
      return res.status(200).json(data); // Data yang sudah diperbarui
    } catch (error) {
      return res.status(500).json({ message: 'Error updating data', error: error.message });
    }
  } else {
    // Mengembalikan status 405 jika metode tidak diperbolehkan
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
