import { supabase } from '../../../../../lib/supabaseClient';    
  
export default async function handler(req, res) {    
    try {    
        const { peg_id } = req.query;    
    
        // Handle GET request    
        if (req.method === 'GET') {    
            if (!peg_id) {    
                return res.status(400).json({ error: "'peg_id' parameter is required" });    
            }    
    
            const { data, error } = await supabase    
                .schema('siap_skpd')    
                .from('spg_riwayat_timkerja')    
                .select('*')    
                .eq('peg_id', peg_id);    
    
            if (error) {    
                return res.status(500).json({ error: error.message });    
            }    
    
            if (!data || data.length === 0) {    
                return res.status(404).json({ error: "No data found for the given peg_id" });    
            }    
    
            return res.status(200).json(data);    
        }    
    
       // Handle POST request
if (req.method === 'POST') {
    const {
        peg_id,
        timkerja_nama,
        timkerja_peran,
        timkerja_nomor,
        tahun,
        timkerja_tingkat,
        timkerja_penandatangan
    } = req.body;

    // Validate required fields
    if (!peg_id || !timkerja_nama || !timkerja_peran || !timkerja_nomor || !tahun || !timkerja_tingkat || !timkerja_penandatangan) {
        return res.status(400).json({ error: "Missing required fields" });
    }
            // Insert new data into the spg_riwayat_timkerja table    
            const { data, error } = await supabase    
                .schema('siap_skpd')    
                .from('spg_riwayat_timkerja')    
                .insert([{    
                    peg_id,    
                    timkerja_nama,    
                    timkerja_peran,    
                    timkerja_nomor,    
                    tahun,    
                    timkerja_tingkat,    
                    timkerja_penandatangan    
                   
                }]);    
    
            if (error) {    
                return res.status(500).json({ error: error.message });    
            }    
    
            // Return a success message along with the newly created data    
            return res.status(201).json({    
                message: "Data successfully added",    
                data    
            });    
        }    
    
        // Handle unsupported methods    
        res.setHeader('Allow', ['GET', 'POST']);    
        return res.status(405).json({ error: `Method ${req.method} not allowed` });    
    } catch (error) {    
        // Handle unexpected errors    
        console.error("Error in handler:", error);    
        return res.status(500).json({ error: error.message });    
    }    
}  
