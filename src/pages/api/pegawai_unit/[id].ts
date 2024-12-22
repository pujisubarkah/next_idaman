import { supabase } from '../../../../lib/supabaseClient'; // Pastikan path sesuai dengan proyek Anda

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Mendapatkan ID dari URL parameter

  if (method === 'GET') {
    try {
      // Fetch data from Supabase berdasarkan peg_id
      const { data, error } = await supabase
        .schema('siap_skpd') // Pastikan nama schema benar
        .from('spg_pegawai') // Pastikan nama tabel benar
        .select('*')
        .eq('peg_id', id); // Menggunakan peg_id sebagai filter

      if (error) throw error;

      return res.status(200).json(data); // Mengirimkan data yang ditemukan
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (method === 'POST') {
    try {
      // Mendapatkan semua kolom dari request body
      const newRecord = req.body; 

      // Validasi input: Anda bisa menambah validasi kolom tertentu jika diperlukan
      if (!newRecord) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Insert data into Supabase
      const { data, error } = await supabase
        .schema('siap_skpd') // Pastikan nama schema benar
        .from('spg_pegawai') // Pastikan nama tabel benar
        .insert([newRecord]); // Insert semua kolom yang ada dalam request body

      if (error) throw error;

      return res.status(201).json(data); // Mengirimkan data yang baru dimasukkan
    } catch (error) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else if (method === 'PUT') {
    try {
      const updatedFields = req.body; // Mendapatkan semua kolom dari request body

      // Validasi input: Anda bisa menambah validasi kolom tertentu jika diperlukan
      if (!updatedFields) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Update data berdasarkan peg_id
      const { data, error } = await supabase
        .schema('siap_skpd') // Pastikan nama schema benar
        .from('spg_pegawai') // Pastikan nama tabel benar
        .update(updatedFields) // Update semua kolom yang ada dalam request body
        .eq('peg_id', id); // Memperbarui data berdasarkan peg_id yang diterima dari query

      if (error) throw error;

      return res.status(200).json(data); // Data yang sudah diperbarui
    } catch (error) {
      return res.status(500).json({ message: 'Error updating data', error: error.message });
    }
  } else {
    // Mengembalikan status 405 jika metode tidak diperbolehkan
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
