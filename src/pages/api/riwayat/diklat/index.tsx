import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil parameter peg_id dan diklat_jenis dari query
        const { peg_id, diklat_jenis } = req.query;

        // Validasi parameter peg_id
        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        // Mulai membangun query utama
        let query = supabase
            .schema('siap_skpd') // Pastikan schema sudah benar
            .from('spg_riwayat_diklat') // Tabel utama
            .select('*')
            .eq('peg_id', peg_id) // Filter berdasarkan peg_id
            .order('diklat_mulai', { ascending: true }); // Urutkan berdasarkan diklat_mulai secara ascending

        // Tambahkan filter untuk diklat_jenis jika diberikan
        if (diklat_jenis) {
            query = query.eq('diklat_jenis', diklat_jenis); // Filter diklat_jenis langsung dari tabel spg_riwayat_diklat
        }

        // Eksekusi query utama
        const { data: riwayatDiklatData, error: riwayatDiklatError } = await query;

        // Jika terjadi error saat query
        if (riwayatDiklatError) {
            throw riwayatDiklatError;
        }

        // Jika data tidak ditemukan
        if (!riwayatDiklatData || riwayatDiklatData.length === 0) {
            return res.status(404).json({ error: "No data found for the given parameters" });
        }

        // Mengambil data dari tabel m_spg_diklat_jenis
        const { data: diklatjenisData, error: diklatjenisError } = await supabase
            .schema('siap')
            .from('m_spg_diklat_jenis')
            .select('diklat_jenis_id, diklat_jenis_nama');

        if (diklatjenisError) {
            throw diklatjenisError;
        }

        // Mengambil data dari tabel m_spg_diklat_teknis
        const { data: diklatteknisData, error: diklatteknisError } = await supabase
            .schema('siap')
            .from('m_spg_diklat_teknis')
            .select('diklat_teknis_id, diklat_teknis_nm');

        if (diklatteknisError) {
            throw diklatteknisError;
        }

        // Mengambil data dari tabel m_spg_diklat_fungsional
        const { data: diklatfungsionalData, error: diklatfungsionalError } = await supabase
            .schema('siap')
            .from('m_spg_diklat_fungsional')
            .select('diklat_fungsional_id, diklat_fungsional_nm');

        if (diklatfungsionalError) {
            throw diklatfungsionalError;
        }

        // Mengambil data dari tabel m_spg_diklat_struk_kategori
        const { data: kategoriData, error: kategoriError } = await supabase
            .schema('siap') // Pastikan schema benar
            .from('m_spg_diklat_struk_kategori')
            .select('kategori_id, kategori_nama, kategori_parent');

        if (kategoriError) {
            throw kategoriError;
        }

        // Mengambil data untuk kategori_parent
        const parentKategoriIds = kategoriData
            .filter(kategori => kategori.kategori_parent)
            .map(kategori => kategori.kategori_parent);

        const { data: parentKategoriData, error: parentKategoriError } = await supabase
            .schema('siap')
            .from('m_spg_diklat_struk_kategori')
            .select('kategori_id, kategori_nama')
            .in('kategori_id', parentKategoriIds);

        if (parentKategoriError) {
            throw parentKategoriError;
        }

        // Fungsi untuk menggabungkan data
        const mergeData = (riwayatDiklatData, diklatjenisData, diklatteknisData, diklatfungsionalData, kategoriData, parentKategoriData) => {
            return riwayatDiklatData.map(riwayat => {
                const diklatJenis = diklatjenisData.find(dj => dj.diklat_jenis_id === riwayat.diklat_jenis);
                const diklatTeknis = diklatteknisData.find(dt => dt.diklat_teknis_id === riwayat.diklat_teknis_id);
                const diklatFungsional = diklatfungsionalData.find(df => df.diklat_fungsional_id === riwayat.diklat_fungsional_id);
                const kategori = kategoriData.find(k => k.kategori_id === riwayat.kategori_id);
                const parentKategori = parentKategoriData.find(pk => pk.kategori_id === kategori?.kategori_parent);

                return {
                    ...riwayat,
                    diklat_jenis: diklatJenis,
                    diklat_teknis: diklatTeknis,
                    diklat_fungsional: diklatFungsional,
                    kategori: {
                        ...kategori,
                        kategori_parent_nama: parentKategori ? parentKategori.kategori_nama : null
                    }
                };
            });
        };

        // Gabungkan data
        const mergedData = mergeData(riwayatDiklatData, diklatjenisData, diklatteknisData, diklatfungsionalData, kategoriData, parentKategoriData);

        // Kirimkan data ke client
        return res.status(200).json(mergedData);
    } catch (error) {
        // Tangani error lain
        console.error("Error fetching data:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
