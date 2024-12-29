import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Supabase sorted by satuan_kerja_nama
      const { data, error } = await supabase
        .schema('siap') // Ensure the schema name is correct
        .from('m_spg_jurusan') // Ensure the table name is correct
        .select('*')
        .order('jurusan_id', { ascending: true }); // Sorting by satuan_kerja_nama in ascending order

      if (error) throw error;

      // Send the fetched data in the response
      return res.status(200).json(data); // Return fetched data
    } catch (error) {
      // Return an error response if the data fetching fails
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { jurusan_nm} = req.body;

      // Validate input
      if (!jurusan_nm) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Insert data into Supabase
      const { data, error } = await supabase
        .schema('siap') // Ensure the schema name is correct
        .from('m_spg_jurusan') // Ensure the table name is correct
        .insert([{ jurusan_nm}]);

      if (error) throw error;

      // Send the inserted data in the response
      return res.status(201).json(data); // Return inserted data
    } catch (error) {
      // Return an error response if the data insertion fails
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else {
    // Return method not allowed if not GET or POST
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
