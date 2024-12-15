import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil parameter peg_id dari query
        const { peg_id } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

    // Filter untuk riw_status NOT IN (1, 2, 3, 4)
    const { data, error } = await supabase
        .schema('siap')
        .from('spg_riwayat_diklat')
        .select('*')
        .eq('peg_id', peg_id) // Filter berdasarkan peg_id
      
           

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "No data found for the given parameters" });
        }

        // Kirimkan data gabungan ke client
        res.status(200).json(data);
    } catch (error) {
        // Tangani error jika terjadi
        res.status(500).json({ error: error.message });
    }
}
