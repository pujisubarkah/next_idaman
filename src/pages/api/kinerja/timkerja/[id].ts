import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    try {
        const { id } = req.query; // Capture the dynamic 'id' from the URL

        // Handle GET request
        if (req.method === 'GET') {
            const { peg_id } = req.query;

            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .select('timkerja_id, peg_id, timkerja_nama, timkerja_nomor, tanggal_timkerja, timkerja_penandatangan, timkerja_peran')
                .eq('peg_id', peg_id)
                .order('tanggal_timkerja', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given peg_id" });
            }

            return res.status(200).json(data);
        }

        // Handle POST request
        if (req.method === 'POST') {
            const { peg_id, timkerja_nama, timkerja_nomor, tanggal_timkerja, timkerja_penandatangan, timkerja_peran } = req.body;

            if (!timkerja_nama || !timkerja_nomor || !tanggal_timkerja || !timkerja_penandatangan || !timkerja_peran) {
                return res.status(400).json({
                    error: "Request body must include 'timkerja_nama', 'timkerja_nomor', 'tanggal_timkerja', 'timkerja_penandatangan', and 'timkerja_peran'.",
                });
            }

            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' is required in the request body" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .insert({ peg_id, timkerja_nama, timkerja_nomor, tanggal_timkerja, timkerja_penandatangan, timkerja_peran });

            if (error) throw error;

            return res.status(201).json({ message: "Data successfully created", data });
        }

        // Handle PUT request
        if (req.method === 'PUT') {
            if (!id) {
                return res.status(400).json({ error: "'id' (timkerja_id) is required in the URL" });
            }

            const { timkerja_nama, tanggal_timkerja, timkerja_penandatangan, timkerja_peran } = req.body;

            if (!timkerja_nama || !tanggal_timkerja || !timkerja_penandatangan || !timkerja_peran) {
                return res.status(400).json({
                    error: "Request body must include 'timkerja_nama', 'tanggal_timkerja', 'timkerja_penandatangan', and 'timkerja_peran'.",
                });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .update({ timkerja_nama, tanggal_timkerja, timkerja_penandatangan, timkerja_peran })
                .eq('timkerja_id', id); // Use 'id' from the URL

            if (error) throw error;

            return res.status(200).json({ message: "Data successfully updated", data });
        }

        // Handle DELETE request
        if (req.method === 'DELETE') {
            if (!id) {
                return res.status(400).json({ error: "'id' (timkerja_id) is required in the URL" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .delete()
                .eq('timkerja_id', id); // Use 'id' from the URL

            if (error) throw error;

            return res.status(200).json({ message: "Data successfully deleted", data });
        }

        // If the HTTP method is not supported
        return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        // Handle errors
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: error.message });
    }
}
