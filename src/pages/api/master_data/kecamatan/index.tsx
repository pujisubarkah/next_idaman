import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { kabupaten_id } = req.query; // Get the kabupaten_id from the query parameters

    try {
      let query = supabase
        .schema('siap') // Ensure the schema is correct
        .from('m_spg_kecamatan') // Ensure the schema and table name are correct
        .select('kabupaten_id, kecamatan_id, kecamatan_nm');

      // If kabupaten_id is provided, filter by it
      if (kabupaten_id) {
        query = query.eq('kabupaten_id', kabupaten_id);
      }

      // Fetch data from Supabase
      const { data, error } = await query;

      if (error) throw error;

      // Send the fetched data in the response
      return res.status(200).json(data); // Return fetched data
    } catch (error) {
      // Return an error response if the data fetching fails
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    // Return method not allowed if not GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
