// /pages/api/riwayat/kontak/[id].ts  
import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the import path  
  
export default async function handler(req, res) {  
    const { method } = req;  
    const { id } = req.query; // Get the ID from the URL  
  
    try {  
        switch (method) {  
            case 'PUT':  
                // Handle PUT request to update an existing contact  
                const updatedData = req.body;  
  
                if (!updatedData) {  
                    return res.status(400).json({ error: "Missing required fields" });  
                }  
  
                const { data: putData, error: putError } = await supabase  
                    .schema('siap')  
                    .from('spg_riwayat_kontak')  
                    .update(updatedData)  
                    .eq('id', id);  
  
                if (putError) {  
                    throw putError;  
                }  
  
                return res.status(200).json(putData);  
  
            case 'DELETE':  
                // Handle DELETE request to remove a contact  
                const { error: deleteError } = await supabase  
                    .schema('siap')  
                    .from('spg_riwayat_kontak')  
                    .delete()  
                    .eq('id', id);  
  
                if (deleteError) {  
                    throw deleteError;  
                }  
  
                return res.status(204).end(); // No content to return after deletion  
  
            default:  
                // Handle any other HTTP method  
                res.setHeader('Allow', ['PUT', 'DELETE']);  
                return res.status(405).end(`Method ${method} Not Allowed`);  
        }  
    } catch (error) {  
        // Handle error if it occurs  
        res.status(500).json({ error: error.message });  
    }  
}  
