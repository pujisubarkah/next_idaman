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
                        gol_id_akhir
                    )
                `);

            if (satuanKerjaError) {
                return res.status(500).json({ error: `Error fetching 'm_spg_satuan_kerja': ${satuanKerjaError.message}` });
            }

            // Fetching data from 'm_spg_golongan'
            const { data: golonganData, error: golonganError } = await supabase
                .schema('siap')
                .from('m_spg_golongan')
                .select(`
                    gol_id,
                    nm_gol
                `);

            if (golonganError) {
                return res.status(500).json({ error: `Error fetching 'm_spg_golongan': ${golonganError.message}` });
            }

            // Map golongan data for easier lookup
            const golonganMap = golonganData.reduce((map, item) => {
                map[item.gol_id] = item.nm_gol;
                return map;
            }, {});

            // Combine and organize data
            const result = satuanKerjaData.map((satuanKerja) => {
                const golonganDetails = {};

                // Organize pegawai data by golongan and calculate total
                satuanKerja.v_pegawai_data.forEach((pegawai) => {
                    const golName = golonganMap[pegawai.gol_id_akhir] || 'Unknown';

                    if (!golonganDetails[golName]) {
                        golonganDetails[golName] = {
                            total: 0,
                            pegawai: [],
                        };
                    }

                    golonganDetails[golName].total += 1; // Increment total pegawai for this golongan
                    golonganDetails[golName].pegawai.push({
                        peg_nama: pegawai.peg_nama,
                        peg_nip: pegawai.peg_nip,
                        satuan_kerja_id: pegawai.satuan_kerja_id,
                        unit_kerja_id: pegawai.unit_kerja_id,
                        satuan_kerja_nama: pegawai.satuan_kerja_nama,
                        unit_kerja_parent_nama: pegawai.unit_kerja_parent_nama,
                        unit_kerja_nama: pegawai.unit_kerja_nama,
                        gol_id_akhir: pegawai.gol_id_akhir,
                        jabatan_nama: pegawai.jabatan_nama,
                    });
                });

                return {
                    satuan_kerja_id: satuanKerja.satuan_kerja_id,
                    satuan_kerja_nama: satuanKerja.satuan_kerja_nama,
                    golongan_details: golonganDetails,
                };
            });

            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ error: `Server Error: ${err.message}` });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
