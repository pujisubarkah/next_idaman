// /pages/api/riwayat/kontak/index.ts  
import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the import path  
  
export default async function handler(req, res) {  
    const { method } = req;  
  
    try {  
        switch (method) {  
            case 'GET':  
                // Get peg_id from query parameters  
                const { peg_id } = req.query;  
  
                if (!peg_id) {  
                    return res.status(400).json({ error: "'peg_id' parameter is required" });  
                }  
  
                // Fetch contacts for the given peg_id  
                const { data, error: getError } = await supabase  
                    .schema('siap')  
                    .from('spg_riwayat_kontak')  
                    .select('*')  
                    .eq('peg_id', peg_id);  
  
                if (getError) {  
                    throw getError;  
                }  
  
                if (data.length === 0) {  
                    return res.status(404).json({ error: "No data found for the given parameters" });  
                }  
  
                // Send the data back to the client  
                return res.status(200).json(data);  
  
            case 'POST':  
                // Handle POST request to create a new contact  
                const { peg_id: postPegId, nama, no_telepon, tinggal_serumah, hubungan, alamat } = req.body;  
  
                if (!postPegId || !nama || !no_telepon || typeof tinggal_serumah !== 'boolean' || !hubungan || !alamat) {  
                    return res.status(400).json({ error: "Missing required fields" });  
                }  
  
                // Insert the new contact and return the inserted data  
                const { data: postData, error: postError } = await supabase  
                    .schema('siap')  
                    .from('spg_riwayat_kontak')  
                    .insert([  
                        { peg_id: postPegId, nama, no_telepon, tinggal_serumah, hubungan, alamat }  
                    ])  
                    .select(); // Add this line to return the inserted data  
  
                if (postError) {  
                    throw postError;  
                }  
  
                // Return a success message along with the newly created data  
                return res.status(201).json({  
                    message: "Data successfully added",  
                    data: postData  
                });  
  
            default:  
                // Handle any other HTTP method  
                res.setHeader('Allow', ['GET', 'POST']);  
                return res.status(405).end(`Method ${method} Not Allowed`);  
        }  
    } catch (error) {  
        // Handle error if it occurs  
        res.status(500).json({ error: error.message });  
    }  
}  
