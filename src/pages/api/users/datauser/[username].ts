import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
  const { method } = req;
  const { username } = req.query;  // Retrieve 'username' from the query parameters

  // Check if the 'username' parameter is provided
  if (!username) {
    return res.status(400).json({ message: 'Parameter username tidak ditemukan' });
  }

  if (method === 'GET') {
    try {
      // Fetch user data based on 'username'
      const { data, error } = await supabase
        .schema('siap_skpd')
        .from('users')
        .select(`
          username, role_id, 
          role:role_id (*)
        `)
        .eq('username', username);  // Fetch by 'username' from query parameters

      // Handle error if any
      if (error) throw error;

      // If no user found, return a 404 status
      if (data.length === 0) {
        return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
      }

      // Return the fetched user data
      return res.status(200).json(data[0]);
    } catch (error) {
      // Return a generic error message and detailed error message
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  }

  // Return an error if the method is not supported
  return res.status(405).json({ message: `Method ${method} Not Allowed` });
}
