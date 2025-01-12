import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the import path  
  
export default async function handler(req, res) {  
    const { id } = req.query; // Get the publication ID from the query  
  
    try {  
        // Handle PUT request  
        if (req.method === 'PUT') {  
            const { peg_id, tahun_terbit, judul, penerbit, level_penerbit, link_publikasi } = req.body;  
  
            if (!peg_id || !tahun_terbit || !judul || !penerbit || !level_penerbit || !link_publikasi) {  
                return res.status(400).json({ error: "All fields are required" });  
            }  
  
            const { data, error } = await supabase  
                .schema('siap_skpd')  
                .from('spg_riwayat_publikasi')  
                .update({ peg_id, tahun_terbit, judul, penerbit, level_penerbit, link_publikasi })  
                .eq('publikasi_id', id); // Assuming 'publikasi_id' is the primary key  
  
            if (error) {  
                throw error;  
            }  
  
            return res.status(200).json(data);  
        }  
  
        // Handle DELETE request  
        if (req.method === 'DELETE') {  
            const { error } = await supabase  
                .schema('siap_skpd')  
                .from('spg_riwayat_publikasi')  
                .delete()  
                .eq('publikasi_id', id); // Assuming 'publikasi_id' is the primary key  
  
            if (error) {  
                throw error;  
            }  
  
            return res.status(204).end(); // No content to return  
        }  
  
        // Handle unsupported methods  
        return res.status(405).json({ error: "Method not allowed" });  
    } catch (error) {  
        console.error("Error processing request:", error.message);  
        return res.status(500).json({ error: error.message });  
    }  
}  
