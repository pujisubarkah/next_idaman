import { supabase } from '../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query; // Get the ID from the query parameters

    try {
      // Fetch the user based on the provided ID
      const { data: users, error: userError } = await supabase  
        .schema('siap_skpd')  
        .from('users')  
        .select('username, role_id, nama')  
        .eq('username', id); // Filter for the user with the provided ID

      if (userError) throw userError;

      if (users.length === 0) {  
        return res.status(404).json({ message: 'User  not found' });  
      }

      const username = users[0].username; // Get the username from the fetched user

      // Fetch action logs for the found user, limited to the year 2024
      const { data: actionLogs, error: actionLogError } = await supabase  
        .schema('siap_skpd')  
        .from('action_log')  
        .select('username, aksi, entity_id, time, keterangan')  
        .eq('username', username) // Filter for action logs by username
        .gte('time', '2024-01-01T00:00:00Z') // Start of 2024
        .lt('time', '2025-01-01T00:00:00Z'); // Start of 2025

      if (actionLogError) throw actionLogError;

      // Create a response object
      const response = {  
        username: username,  
        count: actionLogs.length,  
        nama: users[0].nama,  
        actions: actionLogs.map(log => {
          let keteranganData = {};
          if (log.keterangan) {
            try {
              keteranganData = JSON.parse(log.keterangan); // Convert JSON string to object
            } catch (e) {
              console.error('Error parsing keterangan JSON:', e);
              // Optionally log the invalid JSON string
              console.error('Invalid keterangan:', log.keterangan);
            }
          }
          return {  
            aksi: log.aksi,  
            entity_id: log.entity_id,  
            time: log.time,  
            keterangan: keteranganData // Use the parsed keterangan data
          };
        })  
      };

      // Send the combined data in the response  
      return res.status(200).json(response); // Return combined data  
    } catch (error) {  
      // Return an error response if the data fetching fails  
      return res.status(500).json({ message: 'Error fetching data', error: error.message });  
    }  
  } else {  
    // Return method not allowed if not GET  
    return res.status(405).json({ message: 'Method Not Allowed' });  
  }  
}