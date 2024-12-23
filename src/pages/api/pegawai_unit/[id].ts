import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Parameter ID tidak ditemukan' });
  }

  if (method === 'GET') {
    try {
      const { data, error } = await supabase
      .schema('siap_skpd')
        .from('spg_pegawai')
        .select('peg_nama, peg_nip, peg_gelar_depan') // Kolom yang diambil
        .eq('peg_id', id);

      if (error) throw error;

      if (data.length === 0) {
        return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
      }

      return res.status(200).json(data[0]);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (method === 'POST') {
    try {
      const { peg_nama, peg_nip, peg_gelar_depan } = req.body;

      if (!peg_nama || !peg_nip) {
        return res.status(400).json({ message: 'Nama dan NIP wajib diisi' });
      }

      const { data, error } = await supabase
      .schema('siap_skpd')
        .from('spg_pegawai')
        .insert([{ peg_nama, peg_nip, peg_gelar_depan }]);

      if (error) throw error;

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else if (method === 'PUT') {
    try {
      const { peg_nama, peg_nip, peg_gelar_depan } = req.body;

      if (!peg_nama && !peg_nip && !peg_gelar_depan) {
        return res.status(400).json({ message: 'Tidak ada kolom untuk diperbarui' });
      }

      const { data, error } = await supabase
      .schema('siap_skpd')
        .from('spg_pegawai')
        .update({ peg_nama, peg_nip, peg_gelar_depan })
        .eq('peg_id', id);

      if (error) throw error;

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
