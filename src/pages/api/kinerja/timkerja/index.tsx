import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    try {
        const { peg_id } = req.query;

        // Menangani GET request
        if (req.method === 'GET') {
            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .select('timkerja_id, timkerja_nama, timkerja_nomor, tanggal_timkerja, timkerja_penandatangan, timkerja_peran')
                .eq('peg_id', peg_id)
                .order('tanggal_timkerja', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given peg_id" });
            }

            return res.status(200).json(data);
        }

        // If the HTTP method is not supported (no POST method)
        return res.status(405).json({ error: "Method not allowed" });

    } catch (error) {
        // Handle errors
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: error.message });
    }
}
