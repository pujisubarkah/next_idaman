import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .schema('siap') // Ensure the schema is correct
        .from('m_spg_tingkat_pendidikan') // Ensure the table name is correct
        .select('tingpend_id, nm_tingpend') // Adjust the fields to be fetched
        .order('tingpend_id', { ascending: true }); // Adjust the ordering if needed

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
