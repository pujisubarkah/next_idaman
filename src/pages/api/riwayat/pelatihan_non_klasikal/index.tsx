import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil parameter peg_id dari query
        const { peg_id } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        const { data, error } = await supabase
            .schema('siap_skpd')
            .from('spg_riwayat_nonklasikal')
            .select(`*`)
            .eq('peg_id', peg_id)
            .order('non_tgl_mulai', { ascending: true });  // Ubah 'tingpend_id' ke kolom yang sesuai

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No data found for the given peg_id" });
        }

        // Kirimkan data ke client
        res.status(200).json(data);
    } catch (error) {
        // Tangani error jika terjadi
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: error.message });
    }
}
