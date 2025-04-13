import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil peg_id dari parameter query
        const { peg_id } = req.query;

        // Validasi peg_id
        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        // Query untuk mengambil data dari tabel spg_riwayat_pangkat
        const { data: riwayatPangkatData, error: riwayatPangkatError } = await supabase
            .schema('siap_skpd')
            .from('spg_riwayat_pangkat')
            .select('*')
            .eq('peg_id', peg_id) // Gunakan peg_id yang divalidasi
            .order('riw_pangkat_sktgl', { ascending: true });

        // Tangani error dari Supabase
        if (riwayatPangkatError) {
            console.error("Error fetching riwayat pangkat:", riwayatPangkatError.message);
            return res.status(500).json({ error: riwayatPangkatError.message });
        }

        // Cek jika tidak ada data yang ditemukan
        if (!riwayatPangkatData || riwayatPangkatData.length === 0) {
            return res.status(404).json({ error: "No data found for the given peg_id in spg_riwayat_pangkat" });
        }

        // Fetch data dari tabel m_spg_golongan
        const { data: golonganData, error: golonganError } = await supabase
            .schema('siap')
            .from('m_spg_golongan')
            .select('gol_id, nm_gol');

        // Tangani error dari Supabase
        if (golonganError) {
            console.error("Error fetching golongan data:", golonganError.message);
            return res.status(500).json({ error: golonganError.message });
        }

        // Jika tidak ada data golongan ditemukan, log peringatan
        if (!golonganData || golonganData.length === 0) {
            console.warn("No golongan data found for the given peg_id");
        }

        // Gabungkan data dari kedua tabel
        const responseData = riwayatPangkatData.map(item => {
            const golongan = golonganData.find(g => g.gol_id === item.gol_id); // Pastikan menggunakan gol_id dari riwayatPangkatData
            return {
                ...item,
                nama_golongan: golongan?.nm_gol || null // Gunakan optional chaining
            };
        });

        // Kirimkan data gabungan ke klien
        return res.status(200).json(responseData);
    } catch (error) {
        // Tangani error jika terjadi
        console.error("Error fetching data:", error.message);
        return res.status(500).json({ error: error.message });
    }
}