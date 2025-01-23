import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the import path  
import { NextApiRequest, NextApiResponse } from 'next';  
  
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void | NextApiResponse<any>> {  
    const { method } = req;  
    const { id } = req.query; // Get the publication ID from the query  
  
    if (!id) {  
        return res.status(400).json({ error: "ID is required" });  
    }  
  
    try {  
        switch (method) {  
            case 'PUT':  
                // Handle PUT request to update an existing publication  
                const { peg_id, tahun_terbit, judul, penerbit, level_penerbit, link_publikasi } = req.body;  
  
                if (!peg_id || !tahun_terbit || !judul || !penerbit || !level_penerbit || !link_publikasi) {  
                    return res.status(400).json({ error: "All fields are required" });  
                }  
  
                const { data, error } = await supabase  
                    .schema('siap_skpd')  
                    .from('spg_riwayat_publikasi')  
                    .update({ peg_id, tahun_terbit, judul, penerbit, level_penerbit, link_publikasi })  
                    .eq('publikasi_id', id);  
  
                if (error) {  
                    throw error;  
                }  
  
                return res.status(200).json(data);  
  
            case 'DELETE':  
                // Handle DELETE request to remove a publication  
                const { error: deleteError } = await supabase  
                    .schema('siap_skpd')  
                    .from('spg_riwayat_publikasi')  
                    .delete()  
                    .eq('publikasi_id', id);  
  
                if (deleteError) {  
                    throw deleteError;  
                }  
  
                return res.status(204).end(); // No content to return after deletion  
  
            default:  
                // Handle any other HTTP method  
                res.setHeader('Allow', ['PUT', 'DELETE']);  
                return res.status(405).json({ error: `Method ${method} Not Allowed` });  
        }  
    } catch (error) {  
        // Handle error if it occurs  
        console.error("Error processing request:", error.message);  
        return res.status(500).json({ error: error.message });  
    }  
}  
