import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { peg_id } = req.query;  // Ambil peg_id dari parameter query

        // Memastikan peg_id ada
        if (!peg_id) {
            return res.status(400).json({ error: "Parameter 'peg_id' is required" });
        }

        try {
            // Langkah 1: Ambil peg_nip dari tabel spg_pegawai berdasarkan peg_id
            const { data: pegData, error: pegError } = await supabase
            .schema('siap')
                .from('spg_pegawai')
                .select('peg_nip')  // Hanya ambil kolom peg_nip
                .eq('peg_id', peg_id)  // Filter berdasarkan peg_id
                .single();  // Ambil satu data saja

            if (pegError) {
                return res.status(500).json({ error: pegError.message });
            }

            // Jika tidak ada peg_nip yang ditemukan
            if (!pegData || !pegData.peg_nip) {
                return res.status(404).json({ error: "peg_nip not found for the given peg_id" });
            }

            // Langkah 2: Gunakan peg_id untuk filter data di tabel spg_riwayat_pendidikan
            const { data: pendidikan, error: pendidikanError } = await supabase
                .schema('siap')
                .from('spg_riwayat_pendidikan')
                .select('*')  // Ambil semua data dari tabel spg_riwayat_pendidikan
                .eq('peg_id', peg_id);  // Filter berdasarkan peg_id, bukan peg_nip

            if (pendidikanError) {
                return res.status(500).json({ error: pendidikanError.message });
            }

            // Jika tidak ada data pendidikan ditemukan
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
