import { supabase } from '../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch data from m_spg_jabatan (siap_skpd) where satuan_kerja_id and unit_kerja_id are not null
      const { data, error } = await supabase
        .schema('siap_skpd') // Schema "siap"
        .from('m_spg_jabatan') // Table "m_spg_jabatan"
        .select('satuan_kerja_id, unit_kerja_id, jabatan_jenis, jabatan_id, jabatan_nama, jfu_id, jf_id')
        .not('satuan_kerja_id', 'is', null) // Filter out records where satuan_kerja_id is null
        .not('unit_kerja_id', 'is', null) // Filter out records where unit_kerja_id is null
        .order('satuan_kerja_id, unit_kerja_id, jabatan_jenis', { ascending: true }); // Sorting by satuan_kerja_id, unit_kerja_id, and jabatan_jenis

      if (error) throw error;

      // Grouping data by satuan_kerja_id, then by unit_kerja_id, and finally by jabatan_jenis
      const groupedData = data.reduce((acc, item) => {
        // Create a new object for the item
        const newItem = {
          jabatan_id: item.jabatan_id,
          jabatan_nama: item.jabatan_nama,
          jabatan_jenis: item.jabatan_jenis,
        };

        // Group by satuan_kerja_id
        if (!acc[item.satuan_kerja_id]) {
          acc[item.satuan_kerja_id] = {}; // Initialize an object for each satuan_kerja_id
        }

        // Group by unit_kerja_id within the satuan_kerja_id
        if (!acc[item.satuan_kerja_id][item.unit_kerja_id]) {
          acc[item.satuan_kerja_id][item.unit_kerja_id] = {
            unit_kerja_id: item.unit_kerja_id,
            jabatan: [], // Initialize an array for jabatan
          };
        }

        // Push the new item into the corresponding jabatan array
        acc[item.satuan_kerja_id][item.unit_kerja_id].jabatan.push(newItem);

        return acc; // Return the accumulator for the next iteration
      }, {});

      // Send the grouped data in the response
      return res.status(200).json(groupedData); // Return grouped data
    } catch (error) {
      // Return an error response if the data fetching fails
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    // Return method not allowed if not GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}