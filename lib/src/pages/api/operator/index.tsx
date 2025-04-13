import { supabase } from '../../../../lib/supabaseClient'; // Adjust path accordingly  
  
export default async function handler(req, res) {  
  if (req.method === 'GET') {  
    try {  
      // Fetch data from Supabase with role_id = 1  
      const { data: users, error: userError } = await supabase  
        .schema('siap_skpd') // Ensure the schema is correct  
        .from('users') // Ensure the table name is correct  
        .select('username, role_id, nama')  
        .eq('role_id', 1); // Filter for users with role_id = 1  
  
      if (userError) throw userError;  
  
      // Fetch action logs where username matches  
      const { data: actionLogs, error: actionLogError } = await supabase  
        .schema('siap_skpd') // Ensure the schema is correct  
        .from('action_log') // Ensure the table name is correct  
        .select('username, aksi, entity_id, time');  
  
      if (actionLogError) throw actionLogError;  
  
      // Create a map to store user data with action logs  
      const userMap = {};  
  
      // Initialize user data in the map  
      users.forEach(user => {  
        userMap[user.username] = {  
          username: user.username,  
          count: 0, // Initialize action count  
          nama: user.nama,  
          actions: [] // Initialize actions array  
        };  
      });  
  
      // Populate the user map with action logs  
      actionLogs.forEach(log => {  
        if (userMap[log.username]) {  
          userMap[log.username].count += 1; // Increment action count  
          userMap[log.username].actions.push({  
            aksi: log.aksi,  
            entity_id: log.entity_id,  
            time: log.time  
          });  
        }  
      });  
  
      // Convert the user map to an array  
      const result: { username: string; count: number; nama: string; actions: { aksi: string; entity_id: string; time: string }[] }[] = Object.values(userMap);  
  
      // Sort the result by count in descending order  
      result.sort((a, b) => b.count - a.count);  
  
      // Send the combined data in the response  
      return res.status(200).json(result); // Return combined data  
    } catch (error) {  
      // Return an error response if the data fetching fails  
      return res.status(500).json({ message: 'Error fetching data', error: error.message });  
    }  
  } else {  
    // Return method not allowed if not GET  
    return res.status(405).json({ message: 'Method Not Allowed' });  
  }  
}  

