import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Mengambil data dari tabel m_spg_diklat_struk_kategori
            const { data: kategoriData, error: kategoriError } = await supabase
                .schema('siap')
                .from('m_spg_diklat_struk_kategori')
                .select(`
                    kategori_id,
                    kategori_nama,
                    kategori_parent,
                    kategori_parent_name:kategori_parent(kategori_nama)
                `);

            if (kategoriError) {
                return res.status(500).json({ error: kategoriError.message });
            }

            // Mengambil data dari tabel spg_riwayat_diklat
            const { data: riwayatDiklatData, error: riwayatDiklatError } = await supabase
                .schema('siap')
                .from('spg_riwayat_diklat')
                .select('kategori_id, peg_id');

            if (riwayatDiklatError) {
                return res.status(500).json({ error: riwayatDiklatError.message });
            }

            // Mengambil data dari tabel spg_pegawai dan join dengan tabel m_spg_satuan_kerja
            const { data: pegawaiData, error: pegawaiError } = await supabase
                .schema('siap')
                .from('spg_pegawai')
                .select(`
                    peg_id,
                    peg_nip,
                    peg_nama,
                    satuan_kerja_id,
                    jabatan_id,
                    m_spg_satuan_kerja:satuan_kerja_id (satuan_kerja_nama)
                `); // Mengambil satuan_kerja_nama

            if (pegawaiError) {
                return res.status(500).json({ error: pegawaiError.message });
            }

            // Menghitung jumlah pegawai berdasarkan kategori_id
            const pegawaiCountPerKategori = riwayatDiklatData.reduce((acc, item) => {
                if (!acc[item.kategori_id]) {
                    acc[item.kategori_id] = 0;
                }
                acc[item.kategori_id]++;
                return acc;
            }, {});

            // Menyusun data hasil untuk dikembalikan ke response
            const responseData = kategoriData.map(kategori => {
                const pegawaiCount = pegawaiCountPerKategori[kategori.kategori_id] || 0;

                // Menambahkan data pegawai yang terkait dengan kategori
                const pegawaiInKategori = pegawaiData.filter(pegawai => {
                    return riwayatDiklatData.some(diklat => diklat.kategori_id === kategori.kategori_id && diklat.peg_id === pegawai.peg_id);
                });

                return {
                    ...kategori,
                    pegawai_count: pegawaiCount,
                    pegawai_in_kategori: pegawaiInKategori
                };
            });

            return res.status(200).json(responseData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
