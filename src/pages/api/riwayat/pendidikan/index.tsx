import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { peg_id } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "Parameter 'peg_id' is required" });
        }

        try {
            // Ambil data riwayat pendidikan berdasarkan peg_id
            const { data: pendidikan, error: pendidikanError } = await supabase
                .schema('siap')
                .from('spg_riwayat_pendidikan')
                .select('*')
                .eq('peg_id', peg_id);

            if (pendidikanError) {
                return res.status(500).json({ error: pendidikanError.message });
            }

            // Jika tidak ada data, return 404
            if (!pendidikan || pendidikan.length === 0) {
                return res.status(404).json({ error: "No education data found for the given peg_id" });
            }

            return res.status(200).json(pendidikan);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
