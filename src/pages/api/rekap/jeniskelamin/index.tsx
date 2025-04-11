buatkan kode versi prisma berdasarkan kode di bawah

import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetching data from 'm_spg_satuan_kerja' with nested relation
            const { data: satuanKerjaData, error: satuanKerjaError } = await supabase
                .schema('siap')
                .from('m_spg_satuan_kerja')
                .select(`
                    satuan_kerja_id,
                    satuan_kerja_nama,
                    v_pegawai_data (
                        peg_nama,
                        peg_nip,
                        satuan_kerja_id,
                        unit_kerja_id,
                        satuan_kerja_nama,
                        unit_kerja_parent_nama,
                        unit_kerja_nama,
                        eselon_nm,
                        jabatan_nama,
                        peg_jenis_kelamin
                    )
                `);

            if (satuanKerjaError) {
                return res.status(500).json({ error: `Error fetching 'm_spg_satuan_kerja': ${satuanKerjaError.message}` });
            }

            // Grouping data by jenis kelamin and adding count
            const groupedByGender = satuanKerjaData.map((satuanKerja) => {
                const groupedPegawai = satuanKerja.v_pegawai_data.reduce((acc, pegawai) => {
                    const gender = pegawai.peg_jenis_kelamin || 'Tidak Diketahui';
                    if (!acc[gender]) {
                        acc[gender] = {
                            count: 0,
                            pegawai: []
                        };
                    }
                    acc[gender].pegawai.push(pegawai);
                    acc[gender].count += 1; // Increment count
                    return acc;
                }, {});

                return {
                    satuan_kerja_id: satuanKerja.satuan_kerja_id,
                    satuan_kerja_nama: satuanKerja.satuan_kerja_nama,
                    pegawai_by_gender: groupedPegawai
                };
            });

            return res.status(200).json(groupedByGender);
        } catch (error) {
            return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
