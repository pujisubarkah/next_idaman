import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil parameter peg_id dan riw_status dari query
        const { peg_id, riw_status } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

     

        // Query dengan join antar tabel spg_riwayat dan spg_pegawai, serta filter berdasarkan peg_id dan riw_status
        const { data, error } = await supabase
            .schema('siap') // Jika skema default adalah public, hapus baris ini
            .from('spg_riwayat_pelaksana_struktural')
            .select(`
                *,
                
                jabatan: m_spg_jabatan (jabatan_id, jabatan_nama)
            `)
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