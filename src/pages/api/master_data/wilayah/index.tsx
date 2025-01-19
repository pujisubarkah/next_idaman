import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Supabase with nested joins
      const { data, error } = await supabase
        .schema('siap') // Ensure the schema is correct
        .from('m_spg_propinsi') // Start from the propinsi table
        .select(`
          propinsi_id,
          propinsi_nm,
          m_spg_kabupaten (
            kabupaten_id, 
            kabupaten_nm, 
            m_spg_kecamatan (
              kecamatan_id, 
              kecamatan_nm
            )
          )
        `);

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