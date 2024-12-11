// pages/api/pegawai.js
import { supabase } from '../../../../../lib/supabaseClient'; // Ensure the correct path

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { peg_nip, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pegawai'); // Debugging log

    try {
      // Build Supabase query
      let query = supabase
        .schema('siap')
        .from('view_data_pegawai')
        .select('*', { count: 'exact' });

      // Apply filter if `peg_nip` is provided
      if (peg_nip) {
        query = query.eq('peg_nip', peg_nip);
      }

      // Order by `peg_nama_lengkap` alphabetically
      query = query.order('peg_nama_lengkap', { ascending: true });

      // Apply pagination
      const { data, error, count } = await query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      );

      // Handle Supabase errors
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: error.message });
      }

      // Handle empty data
      if (!data || data.length === 0) {
        console.log('No data found');
        return res.status(404).json({ message: 'Data not found' });
      }

   

      // Return data with total count
      return res.status(200).json({
        data: data,
        totalItems: count || 0,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle methods other than GET
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
