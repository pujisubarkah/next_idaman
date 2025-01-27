import { supabase } from '../../../../../lib/supabaseClient';  
  
export default async function handler(req, res) {  
    if (req.method === 'GET') {  
        try {  
            // Existing GET logic...  
            const { data: jfData, error: jfError } = await supabase  
                .schema('siap')  
                .from('m_spg_referensi_jf')  
                .select('jf_id, jf_nama, jf_gol_awal_id, jf_gol_akhir_id, jf_skill');  
  
            if (jfError) {  
                return res.status(500).json({ error: jfError.message });  
            }  
  
            const { data: jabatanData, error: jabatanError } = await supabase  
                .schema('siap')  
                .from('m_spg_jabatan')  
                .select('jabatan_id, jf_id');  
  
            if (jabatanError) {  
                return res.status(500).json({ error: jabatanError.message });  
            }  
  
            const { data: spgData, error: spgError } = await supabase  
                .schema('siap')  
                .from('spg_pegawai')  
                .select('peg_nip, peg_nama, satuan_kerja_id, jabatan_id');  
  
            if (spgError) {  
                return res.status(500).json({ error: spgError.message });  
            }  
  
            const { data: satuanKerjaData, error: satuanKerjaError } = await supabase  
                .schema('siap')  
                .from('m_spg_satuan_kerja')  
                .select('satuan_kerja_id, satuan_kerja_nama');  
  
            if (satuanKerjaError) {  
                return res.status(500).json({ error: satuanKerjaError.message });  
            }  
  
            const groupedResult = jfData.map(jf => {  
                const relatedJabatan = jabatanData.filter(jabatan => jabatan.jf_id === jf.jf_id);  
                const pegawai = relatedJabatan.flatMap(jabatan =>  
                    spgData.filter(spg => spg.jabatan_id === jabatan.jabatan_id)  
                );  
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
                    total_pegawai: pegawaiWithSatuanKerja.length,  
                    pegawai: pegawaiWithSatuanKerja,  
                };  
            }).filter(group => group.total_pegawai > 0);  
  
            return res.status(200).json(groupedResult);  
        } catch (error) {  
            return res.status(500).json({ error: error.message });  
        }  
    } else if (req.method === 'POST') {  
        try {  
            // Existing POST logic...  
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
  
            const { data, error } = await supabase  
                .schema('siap')  
                .from('m_spg_referensi_jf')  
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
    } else if (req.method === 'PUT') {  
        try {  
            const { jf_id, ...updateData } = req.body;  
  
            if (!jf_id) {  
                return res.status(400).json({ error: 'jf_id wajib diisi' });  
            }  
  
            const { data: existingData, error: existingError } = await supabase  
                .schema('siap')  
                .from('m_spg_referensi_jf')  
                .select('*')  
                .eq('jf_id', jf_id)  
                .single();  
  
            if (existingError) {  
                return res.status(500).json({ error: existingError.message });  
            }  
  
            if (!existingData) {  
                return res.status(404).json({ error: 'Data tidak ditemukan' });  
            }  
  
            const { data, error } = await supabase  
                .schema('siap')  
                .from('m_spg_referensi_jf')  
                .update(updateData)  
                .eq('jf_id', jf_id)  
                .select();  
  
            if (error) {  
                return res.status(500).json({ error: error.message });  
            }  
  
            return res.status(200).json({ message: 'Data berhasil diperbarui', data });  
        } catch (error) {  
            return res.status(500).json({ error: error.message });  
        }  
    } else if (req.method === 'DELETE') {  
        try {  
            const { jf_id } = req.body;  
  
            if (!jf_id) {  
                return res.status(400).json({ error: 'jf_id wajib diisi' });  
            }  
  
            const { data: existingData, error: existingError } = await supabase  
                .schema('siap')  
                .from('m_spg_referensi_jf')  
                .select('*')  
                .eq('jf_id', jf_id)  
                .single();  
  
            if (existingError) {  
                return res.status(500).json({ error: existingError.message });  
            }  
  
            if (!existingData) {  
                return res.status(404).json({ error: 'Data tidak ditemukan' });  
            }  
  
            const { data, error } = await supabase  
                .schema('siap')  
                .from('m_spg_referensi_jf')  
                .delete()  
                .eq('jf_id', jf_id)  
                .select();  
  
            if (error) {  
                return res.status(500).json({ error: error.message });  
            }  
  
            return res.status(200).json({ message: 'Data berhasil dihapus', data });  
        } catch (error) {  
            return res.status(500).json({ error: error.message });  
        }  
    } else {  
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);  
        return res.status(405).json({ error: `Metode ${req.method} tidak diizinkan` });  
    }  
}  
