import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    const { id } = req.query; // Get the id from the query parameters

    try {
        // Handle PUT request
        if (req.method === 'PUT') {
            if (!id) {
                return res.status(400).json({ error: "'id' parameter is required" });
            }

            const {
                peg_id,
                nik,
                nip,
                riw_nama,
                riw_ket,
                riw_kelamin,
                riw_tempat_lahir,
                riw_tgl_lahir,
                is_asn,
                is_asn_satu_instansi,
                riw_pendidikan,
                riw_pekerjaan,
                riw_status,
            } = req.body;

            if (!peg_id || !riw_nama) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat')
                .update({
                    peg_id,
                    nik,
                    nip,
                    riw_nama,
                    riw_ket,
                    riw_kelamin,
                    riw_tempat_lahir,
                    riw_tgl_lahir,
                    is_asn,
                    is_asn_satu_instansi,
                    riw_pendidikan,
                    riw_pekerjaan,
                    riw_status,
                })
                .eq('riw_id', id) // Use the correct column name
                .select();

            if (error) {
                console.error("Error updating data:", error);
                return res.status(500).json({ error: error.message });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given riw_id" });
            }

            return res.status(200).json({
                message: "Data successfully updated",
                data
            });
        }

        // Handle DELETE request
        if (req.method === 'DELETE') {
            if (!id) {
                return res.status(400).json({ error: "'id' parameter is required" });
            }

            const { error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat')
                .delete()
                .eq('riw_id', id); // Use the correct column name

            if (error) {
                console.error("Error deleting data:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({
                message: "Data successfully deleted"
            });
        }

        // Handle unsupported methods
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (error) {
        console.error("Error in handler:", error);
        return res.status(500).json({ error: error.message });
    }
}
