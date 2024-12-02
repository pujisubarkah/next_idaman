// pages/api/unit-kerja.js

// pages/api/unit-kerja.js

import { supabase } from '../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .schema("siap")
        .from("m_spg_unit_kerja")
        .select(
          `unit_kerja_id, 
            unit_kerja_parent, 
            unit_kerja_nama, 
            satuan_kerja_id, 
            spg_pegawai(unit_kerja_id), 
            m_spg_satuan_kerja(satuan_kerja_nama)`
        );

      if (error) throw error;

      // Filter data and map the results
      const filteredData = data
        .filter((unit) => unit.unit_kerja_id !== 99) // Remove unit_kerja_id = 99
        .map((unit) => ({
          ...unit,
          jumlahPegawai: unit.spg_pegawai.length, // Add jumlah pegawai
          satuanKerjaNama: unit.m_spg_satuan_kerja?.satuan_kerja_nama || "Tidak Diketahui",
        }))
        .sort((a, b) => {
          // Sort by satuan_kerja_id, then unit_kerja_id
          if (a.satuan_kerja_id !== b.satuan_kerja_id) {
            return a.satuan_kerja_id - b.satuan_kerja_id;
          }
          return a.unit_kerja_id - b.unit_kerja_id;
        });

      // Send the filtered and sorted data in the response
      return res.status(200).json(filteredData);
    } catch (error) {
      // Return an error response if the data fetching fails
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    // Return method not allowed if not GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
