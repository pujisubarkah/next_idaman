import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    const { peg_id } = req.query;

    try {
        // Handle GET request
        if (req.method === 'GET') {
            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat')
                .select('*')
                .eq('peg_id', peg_id)
                .eq('riw_status', '1');

            if (error) {
                console.error("Error fetching data:", error);
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
                .insert([{
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
                }]);

            if (error) {
                console.error("Error inserting data:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(201).json({
                message: "Data successfully added",
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
