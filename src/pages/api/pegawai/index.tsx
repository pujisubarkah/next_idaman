// pages/api/pegawai.js
import { supabase } from '../../../../lib/supabaseClient'; // Ensure the correct path

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { searchQuery, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pegawai'); // Log for debugging

    try {
      // Build the Supabase query
      let query = supabase
        .schema('siap')
        .from('view_data_pegawai')
        .select('*', { count: 'exact' });

      // Filter by peg_status = true
      query = query.eq('peg_status', true);

      // Filter by searchQuery if available
      if (searchQuery) {
        query = query.ilike('peg_nama_lengkap', `%${searchQuery}%`);
      }

      // Order by peg_nama_lengkap alphabetically
      query = query.order('peg_nama_lengkap', { ascending: true });

      // Apply pagination using range
      const { data, error, count } = await query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      );

      // Handle errors from Supabase
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: error.message });
      }

      // If no data is found
      if (!data || data.length === 0) {
        console.log('No data found');
        return res.status(404).json({ message: 'Data not found' });
      }

      // Return the data with total count
      return res.status(200).json({
        data,
        totalItems: count || 0,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // If method is not GET, return 405 (Method Not Allowed)
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
