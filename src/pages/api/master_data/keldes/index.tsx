import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { kecamatan_id } = req.query; // Get the kecamatan_id from the query parameters

    try {
      let query = supabase
        .schema('siap') // Ensure the schema is correct
        .from('m_keldes') // Ensure the schema and table name are correct
        .select('kecamatan_id, id, nama');

      // If kecamatan_id is provided, filter by it
      if (kecamatan_id) {
        query = query.eq('kecamatan_id', kecamatan_id);
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
