import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil parameter peg_id dan diklat_jenis dari query
        const { peg_id, diklat_jenis } = req.query;

        // Validasi parameter peg_id
        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        // Mulai membangun query
        let query = supabase
            .schema('siap') // Pastikan schema sudah benar
            .from('spg_riwayat_diklat') // Tabel utama
            .select(`
                * ,
                m_spg_diklat_jenis(diklat_jenis_nama),
                m_spg_diklat_teknis(diklat_teknis_nm),
                m_spg_diklat_struk_kategori(kategori_nama),
                m_spg_diklat_fungsional(diklat_fungsional_nm)
            `)
            .eq('peg_id', peg_id) // Filter berdasarkan peg_id
            .order('diklat_mulai', { ascending: true }); // Urutkan berdasarkan diklat_mulai secara ascending

        // Tambahkan filter untuk diklat_jenis jika diberikan
        if (diklat_jenis) {
            query = query.eq('diklat_jenis', diklat_jenis); // Filter diklat_jenis langsung dari tabel spg_riwayat_diklat
        }

        // Eksekusi query
        const { data, error } = await query;

        // Jika terjadi error saat query
        if (error) {
            throw error;
        }

        // Jika data tidak ditemukan
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No data found for the given parameters" });
        }

        // Kirimkan data ke client
        return res.status(200).json(data);
    } catch (error) {
        // Tangani error lain
        console.error("Error fetching data:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
