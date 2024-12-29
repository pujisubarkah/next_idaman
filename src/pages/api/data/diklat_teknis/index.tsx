import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the path

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetching categories from m_spg_diklat_fungsional table
            const { data: kategoriData, error: kategoriError } = await supabase
                .schema('siap')
                .from('m_spg_diklat_teknis')
                .select(`
                    diklat_teknis_id,
                    diklat_teknis_nm
                `);

            if (kategoriError) {
                return res.status(500).json({ error: kategoriError.message });
            }

            // Fetching data from spg_riwayat_diklat where diklat_jenis = 2
            const { data: riwayatDiklatData, error: riwayatDiklatError } = await supabase
                .schema('siap')
                .from('spg_riwayat_diklat')
                .select('diklat_teknis_id, peg_id')
                .eq('diklat_jenis', 3);  // Filter for diklat_jenis = 2

            if (riwayatDiklatError) {
                return res.status(500).json({ error: riwayatDiklatError.message });
            }

            // Fetching data from spg_pegawai and joining with m_spg_satuan_kerja
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
                `); // Fetching satuan_kerja_nama

            if (pegawaiError) {
                return res.status(500).json({ error: pegawaiError.message });
            }

            // Counting employees based on diklat_fungsional_id
            const pegawaiCountPerKategori = (riwayatDiklatData || []).reduce((acc, item) => {
                if (!acc[item.diklat_teknis_id]) {
                    acc[item.diklat_teknis_id] = 0;
                }
                acc[item.diklat_teknis_id]++;
                return acc;
            }, {});

            // Structuring the response data
            const responseData = kategoriData.map(kategori => {
                const pegawaiCount = pegawaiCountPerKategori[kategori.diklat_teknis_id] || 0;

                // Adding employee data related to the category
                const pegawaiInKategori = pegawaiData.filter(pegawai => {
                    return riwayatDiklatData.some(diklat => diklat.diklat_teknis_id === kategori.diklat_teknis_id && diklat.peg_id === pegawai.peg_id);
                });

                return {
                    ...kategori,
                    pegawai_count: pegawaiCount,
                    pegawai: pegawaiInKategori
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
