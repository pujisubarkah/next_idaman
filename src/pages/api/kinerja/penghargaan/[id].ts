import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    const { id } = req.query; // Ambil id dari query

    if (req.method === 'PUT') {
        try {
            // Ambil data dari body permintaan
            const {
                peg_id,
                penghargaan_id,
                riw_penghargaan_pejabat,
                riw_penghargaan_instansi,
                riw_penghargaan_thn,
                riw_penghargaan_tglsk,
                riw_penghargaan_lokasi,
            } = req.body;

            // Validasi input
            if (!id || !peg_id || !penghargaan_id) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Update data di Supabase
            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_penghargaan')
                .update({
                    peg_id,
                    penghargaan_id,
                    riw_penghargaan_pejabat,
                    riw_penghargaan_instansi,
                    riw_penghargaan_thn,
                    riw_penghargaan_tglsk,
                    riw_penghargaan_lokasi,
                })
                .eq('riw_penghargaan_id', id);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(200).json(data);
        } catch (error) {
            console.error("Error updating data:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === 'DELETE') {
        try {
            // Hapus data dari Supabase
            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_penghargaan')
                .delete()
                .eq('riw_penghargaan_id', id);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            // Return 204 No Content without a body
            return res.status(204).end();
        } catch (error) {
            console.error("Error deleting data:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        // Method not allowed
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
