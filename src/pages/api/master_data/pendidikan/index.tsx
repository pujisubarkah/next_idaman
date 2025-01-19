import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get kat_pend_id from query parameters
      const { kat_pend_id } = req.query;

      // Check if kat_pend_id is provided
      if (!kat_pend_id) {
        return res.status(400).json({ message: 'kat_pend_id is required' });
      }

      // Fetch data from Supabase and filter by kat_pend_id
      const { data, error } = await supabase
        .schema('siap') // Ensure the schema is correct
        .from('m_spg_pendidikan') // Corrected table name
        .select('kat_pend_id, id_pend, nm_pend')
        .eq('kat_pend_id', kat_pend_id); // Filter by kat_pend_id

      if (error) {
        console.error('Error fetching data:', error); // Log the error for debugging
        throw error;
      }

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