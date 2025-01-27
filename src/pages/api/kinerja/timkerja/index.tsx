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
                return res.status(500).json({ error: "Failed to fetch data" });
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
        console.error("Supabase Error:", error); // Log the error from Supabase
        return res.status(500).json({ error: "Failed to add data", details: error.message });
    }

    return res.status(201).json({
        message: "Data successfully added",
        data
    });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}