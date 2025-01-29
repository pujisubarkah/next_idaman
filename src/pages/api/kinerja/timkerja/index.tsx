import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    try {
        const { peg_id } = req.query;

        // Handle GET request
        if (req.method === 'GET') {
            // Validate peg_id parameter
            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            // Fetch data from spg_riwayat_timkerja
            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .select('*') 
                .eq('peg_id', peg_id)
                .order('tanggal_timkerja', { ascending: true });

            // Handle error from Supabase
            if (error) {
                console.error("Error fetching data:", error.message);
                return res.status(500).json({ error: error.message });
            }

            // Check if data is found
            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given peg_id" });
            }

            // Return the fetched data
            return res.status(200).json(data);
        }

        // Handle POST request
        if (req.method === 'POST') {
            const { peg_id, timkerja_nama, timkerja_nomor, tanggal_timkerja, timkerja_penandatangan, timkerja_peran, tahun, timkerja_tingkat } = req.body;
        
            // Validate input
            if (!peg_id || !timkerja_nama || !timkerja_nomor || !tanggal_timkerja || !tahun || !timkerja_tingkat || !timkerja_penandatangan || !timkerja_peran) {
                return res.status(400).json({ error: "Missing required fields" });
            }
        
            // Insert data into spg_riwayat_timkerja
            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .insert([
                    {
                        peg_id,
                        timkerja_nama,
                        timkerja_nomor,
                        tanggal_timkerja,
                        timkerja_penandatangan,
                        timkerja_peran,
                        tahun,
                        timkerja_tingkat
                    }
                ]);
        
            // Handle error from Supabase
            if (error) {
                console.error("Error inserting data:", error);
                return res.status(500).json({ error: error.message });
            }
        
            // Return success message
            return res.status(201).json({
                message: "Data successfully added to spg_riwayat_timkerja",
                data
            });
        }

        // Handle unsupported methods
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (error) {
        console.error("Error in handler:", error);
        return res.status(500).json({ error: error.message });
    }
}