// pages/api/statuses.js
import { supabase } from '../../../../lib/supabaseClient'; // Adjusted path

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch status data from the 'm_status' table in the 'siap_skpd' schema
      const { data, error } = await supabase
        .schema('siap_skpd')
        .from('m_status')
        .select('id, status');

      if (error) {
        console.error("Error fetching data:", error.message);
        return res.status(500).json({ error: error.message });
      }

      // Calculate the count for each status_id in 'status_edit_pegawai'
      const statusesWithCount = await Promise.all(
        data.map(async (status) => {
          const { count, error: countError } = await supabase
            .schema('siap_skpd')
            .from('status_edit_pegawai')
            .select('*', { count: 'exact', head: true }) // Count the rows
            .eq('status_id', status.id); // Link to 'm_status.id'

          if (countError) {
            console.error("Error counting status_id:", countError);
            throw countError;
          }

          // Debug log to see the count
          console.log(`Count for status ${status.id} (${status.status}):`, count);

          return {
            ...status,
            jumlah: count || 0, // Add the count to the status data
          };
        })
      );

      // Return the statuses with the count
      res.status(200).json(statusesWithCount);

    } catch (error) {
      console.error("Server error:", error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // If the HTTP method is not GET
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
