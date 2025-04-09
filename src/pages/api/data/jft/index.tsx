import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Ambil data dengan join dari semua tabel
            const { data, error } = await supabase
                .schema('siap')
                .from('m_spg_referensi_jf')
                .select(`
                    jf_id, 
                    jf_nama, 
                    jf_gol_awal_id, 
                    jf_gol_akhir_id, 
                    jf_skill, 
                    m_spg_jabatan (
                        jabatan_id,
                        spg_pegawai (
                            peg_nip, 
                            peg_nama, 
                            satuan_kerja_id,
                            m_spg_satuan_kerja (satuan_kerja_nama)
                        )
                    )
                `);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            // Filter hanya jabatan yang memiliki pegawai
            const filteredData = data
                .map(jf => ({
                    ...jf,
                    m_spg_jabatan: jf.m_spg_jabatan
                        .map(jabatan => ({
                            ...jabatan,
                            jumlah_pegawai: jabatan.spg_pegawai.length // Hitung jumlah pegawai
                        }))
                        .filter(jabatan => jabatan.jumlah_pegawai > 0) // Hapus yang tidak ada pegawainya
                }))
                .filter(jf => jf.m_spg_jabatan.length > 0); // Hapus referensi jika tidak ada jabatan yang memiliki pegawai

            return res.status(200).json(filteredData);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
