import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the import path  
  
export default async function handler(req, res) {  
    try {  
        // Handle GET request  
        if (req.method === 'GET') {  
            const { peg_id } = req.query;  
  
            if (!peg_id) {  
                return res.status(400).json({ error: "'peg_id' parameter is required" });  
            }  
  
            const { data, error } = await supabase  
                .schema('siap_skpd')  
                .from('spg_riwayat_publikasi')  
                .select(`*`)  
                .eq('peg_id', peg_id)  
                .order('tahun_terbit', { ascending: true });  
  
            if (error) {  
                throw error;  
            }  
  
            if (!data || data.length === 0) {  
                return res.status(404).json({ error: "No data found for the given peg_id" });  
            }  
  
            // Send data to client  
            return res.status(200).json(data);  
        }  
  
        // Handle POST request  
        if (req.method === 'POST') {  
            const { peg_id, tahun_terbit, judul, penerbit, level_penerbit, link_publikasi } = req.body;  
  
            if (!peg_id || !tahun_terbit || !judul || !penerbit || !level_penerbit || !link_publikasi) {  
                return res.status(400).json({ error: "All fields are required" });  
            }  
  
            const { data, error } = await supabase  
                .schema('siap_skpd')  
                .from('spg_riwayat_publikasi')  
                .insert([  
                    { peg_id, tahun_terbit, judul, penerbit, level_penerbit, link_publikasi }  
                ]);  
  
            if (error) {  
                throw error;  
            }  
  
            return res.status(201).json(data);  
        }  
  
        // Handle unsupported methods  
        return res.status(405).json({ error: "Method not allowed" });  
    } catch (error) {  
        console.error("Error fetching data:", error.message);  
        return res.status(500).json({ error: error.message });  
    }  
}  
