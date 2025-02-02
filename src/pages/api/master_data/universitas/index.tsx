import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const totalRows = 5065; // Total number of rows you expect
      const limit = 1000; // Number of rows per request
      const totalPages = Math.ceil(totalRows / limit); // Calculate total pages
      let allData: { univ_id: any; univ_nmpti: any; univ_kota: any }[] = []; // Array to hold all fetched data

      // Loop through each page to fetch data
      for (let page = 0; page < totalPages; page++) {
        const { data, error } = await supabase
          .schema('siap') // Ensure the schema is correct
          .from('m_spg_universitas') // Ensure the table name is correct
          .select('univ_id, univ_nmpti, univ_kota') // Ensure the column names are correct
          .range(page * limit, (page + 1) * limit - 1); // Fetch data for the current page

        if (error) throw error; // Handle any errors

        allData = allData.concat(data); // Concatenate the fetched data
      }

      // Send the fetched data in the response
      return res.status(200).json(allData); // Return all fetched data
    } catch (error) {
      // Return an error response if the data fetching fails
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      // Extract data from the request body
      const { univ_nmpti, univ_kota } = req.body;

      // Validate required fields
      if (!univ_nmpti || !univ_kota) {
        return res.status(400).json({ message: 'Missing required fields: univ_nmpti and univ_kota are required.' });
      }

      // Insert new university data into the Supabase table
      const { data, error } = await supabase
        .schema('siap') // Ensure the schema is correct
        .from('m_spg_universitas') // Ensure the table name is correct
        .insert([{ univ_nmpti, univ_kota }]) // Insert the new university data
        .select(); // Optionally return the inserted data

      if (error) throw error;

      // Send the inserted data in the response
      return res.status(201).json({ message: 'University added successfully', data });
    } catch (error) {
      // Return an error response if the insertion fails
      return res.status(500).json({ message: 'Error adding university', error: error.message });
    }
  } else {
    // Return method not allowed if not GET or POST
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
