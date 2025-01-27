import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Mengambil data dari tabel m_spg_referensi_jf
            const { data: jfData, error: jfError } = await supabase
                .schema('siap')
                .from('m_spg_referensi_jf')
                .select('jf_id, jf_nama, jf_gol_awal_id, jf_gol_akhir_id, jf_skill');

            if (jfError) {
                return res.status(500).json({ error: jfError.message });
            }

            // Mengambil data dari tabel m_spg_jabatan
            const { data: jabatanData, error: jabatanError } = await supabase
                .schema('siap')
                .from('m_spg_jabatan')
                .select('jabatan_id, jf_id');

            if (jabatanError) {
                return res.status(500).json({ error: jabatanError.message });
            }

            // Mengambil data dari tabel spg_pegawai
            const { data: spgData, error: spgError } = await supabase
                .schema('siap')
                .from('spg_pegawai')
                .select('peg_nip, peg_nama, satuan_kerja_id, jabatan_id');

            if (spgError) {
                return res.status(500).json({ error: spgError.message });
            }

            // Mengambil data dari tabel m_spg_satuan_kerja
            const { data: satuanKerjaData, error: satuanKerjaError } = await supabase
                .schema('siap')
                .from('m_spg_satuan_kerja')
                .select('satuan_kerja_id, satuan_kerja_nama');

            if (satuanKerjaError) {
                return res.status(500).json({ error: satuanKerjaError.message });
            }

            // Mengelompokkan data berdasarkan jf_id
            const groupedResult = jfData.map(jf => {
                // Menghubungkan data jabatan dengan jf_id
                const relatedJabatan = jabatanData.filter(jabatan => jabatan.jf_id === jf.jf_id);

                // Menghubungkan data pegawai dengan jabatan_id
                const pegawai = relatedJabatan.flatMap(jabatan =>
                    spgData.filter(spg => spg.jabatan_id === jabatan.jabatan_id)
                );

                // Menambahkan satuan_kerja_nama ke data pegawai
                const pegawaiWithSatuanKerja = pegawai.map(spg => {
                    const satuanKerja = satuanKerjaData.find(
                        sk => sk.satuan_kerja_id === spg.satuan_kerja_id
                    );
                    return {
                        peg_nip: spg.peg_nip,
                        peg_nama: spg.peg_nama,
                        satuan_kerja_id: spg.satuan_kerja_id,
                        satuan_kerja_nama: satuanKerja ? satuanKerja.satuan_kerja_nama : null,
                    };
                });

                return {
                    jf_id: jf.jf_id,
                    jf_nama: jf.jf_nama,
                    jf_gol_awal_id: jf.jf_gol_awal_id,
                    jf_gol_akhir_id: jf.jf_gol_akhir_id,
                    jf_skill: jf.jf_skill,
                    total_pegawai: pegawaiWithSatuanKerja.length, // Jumlah pegawai per jf_id
                    pegawai: pegawaiWithSatuanKerja,
                };
            }).filter(group => group.total_pegawai > 0); // Filter hasil untuk hanya menyertakan data dengan total_pegawai > 0

            return res.status(200).json(groupedResult);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            // Mendapatkan data dari body request
            const {
                jf_nama,
                rumpun_id,
                jf_gol_awal_id,
                jf_gol_akhir_id,
                jf_kode,
                jf_bup,
                jf_skill,
                jf_kelas,
                kode_jabatan
            } = req.body;

            // Memastikan semua data yang dibutuhkan tersedia
            if (
                !jf_nama ||
                !rumpun_id ||
                !jf_gol_awal_id ||
                !jf_gol_akhir_id ||
                !jf_kode ||
                !jf_bup ||
                !jf_skill ||
                !jf_kelas ||
                !kode_jabatan
            ) {
                return res.status(400).json({ error: 'Semua field wajib diisi' });
            }

            // Menyisipkan data ke dalam tabel m_spg_jabatan
            const { data, error } = await supabase
                .schema('siap') // Pastikan schema sesuai
                .from('m_spg_referensi_jf') // Pastikan nama tabel sesuai
                .insert([
                    {
                        jf_nama,
                        rumpun_id,
                        jf_gol_awal_id,
                        jf_gol_akhir_id,
                        jf_kode,
                        jf_bup,
                        jf_skill,
                        jf_kelas,
                        kode_jabatan
                    }
                ]);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(201).json({ message: 'Data berhasil disimpan', data });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Metode ${req.method} tidak diizinkan` });
    }
}
