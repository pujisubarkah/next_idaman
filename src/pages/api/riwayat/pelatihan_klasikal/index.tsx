import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Handle GET request
        try {
            const { peg_id } = req.query;

            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_nonformal')
                .select('*')
                .eq('peg_id', peg_id)
                .order('non_tgl_mulai', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given peg_id" });
            }

            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        // Handle POST request
        try {
            const { peg_id, non_tgl_mulai, non_tgl_selesai, deskripsi } = req.body;

            if (!peg_id || !non_tgl_mulai || !non_tgl_selesai || !deskripsi) {
                return res.status(400).json({
                    error: "Missing required fields: 'peg_id', 'non_tgl_mulai', 'non_tgl_selesai', 'deskripsi'"
                });
            }

            // Menambahkan data ke spg_riwayat_nonformal dengan status_id = 1 (Draft)
            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_nonformal')
                .insert([
                    { non_tgl_mulai, non_tgl_selesai, deskripsi}
                ]);

            if (error) throw error;

            // Update status di tabel status_edit_pegawai menjadi status_id = 1 (Draft)
            const { error: updateError } = await supabase
                .schema('siap_skpd')  // Pastikan schema sesuai
                .from('status_edit_pegawai')
                .upsert([
                    { peg_id, status_id: 1 } // Update status_id menjadi 1
                ]);

            if (updateError) throw updateError;

            res.status(201).json({ message: "Data successfully added to siap_skpd with status_id = 1 (Draft) and status_edit_pegawai updated", data });
        } catch (error) {
            console.error("Error adding data:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        // Handle unsupported methods
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
