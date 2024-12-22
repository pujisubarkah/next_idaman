import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil parameter peg_id atau peg_nama dari query
        const { peg_id, peg_nama } = req.query;

        // Mulai query ke Supabase
        let query = supabase
            .schema('siap') // Gunakan schema yang sesuai
            .from('spg_pegawai') // Gunakan schema dalam nama tabel
            .select(`peg_id, 
                peg_nama, 
                peg_nip, 
                satuan_kerja_id, 
                peg_status, 
                peg_ketstatus, 
                m_spg_satuan_kerja(satuan_kerja_nama)`);

        // Jika peg_id diberikan, tambahkan filter
        if (peg_id) {
            query = query.eq('peg_id', peg_id); // Filter berdasarkan peg_id
        }

        // Jika peg_nama diberikan, tambahkan filter untuk pencarian nama
        if (peg_nama) {
            query = query.ilike('peg_nama', `%${peg_nama}%`); // Pencarian case-insensitive untuk peg_nama
        }

        // Eksekusi query
        const { data, error } = await query;

        // Tangani error dari Supabase
        if (error) {
            throw error;
        }

        // Jika tidak ada data
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }

        // Kirimkan data ke client
        res.status(200).json(data);
    } catch (error) {
        // Tangani error jika terjadi
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: error.message });
    }
}
