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
                        satuan_kerja_nama,
                        unit_kerja_parent_nama,
                        unit_kerja_nama,
                        eselon_nm,
                        jabatan_nama,
                        nm_tingpend_akhir
                    )
                `);

            if (satuanKerjaError) {
                return res.status(500).json({ error: `Error fetching 'm_spg_satuan_kerja': ${satuanKerjaError.message}` });
            }

            // Grouping the data based on 'nm_tingpend_akhir'
            const groupedData: {
                satuan_kerja_id: number;
                satuan_kerja_nama: string;
                pegawai_by_pendidikan: { [key: string]: any[] };
                pegawai_count: number;
            }[] = [];

            satuanKerjaData.forEach((item) => {
                const groupedPegawai = {};

                // Loop through v_pegawai_data to group by 'nm_tingpend_akhir'
                item.v_pegawai_data.forEach((pegawai) => {
                    const level = pegawai.nm_tingpend_akhir || 'Unknown'; // Default to 'Unknown' if nm_tingpend_akhir is null

                    // Initialize the group if it doesn't exist
                    if (!groupedPegawai[level]) {
                        groupedPegawai[level] = [];
                    }

                    // Add the pegawai to the corresponding group
                    groupedPegawai[level].push(pegawai);
                });

                // Push the grouped data for each 'satuan_kerja'
                groupedData.push({
                    satuan_kerja_id: item.satuan_kerja_id,
                    satuan_kerja_nama: item.satuan_kerja_nama,
                    pegawai_by_pendidikan: groupedPegawai,
                    pegawai_count: item.v_pegawai_data.length
                });

            });

            return res.status(200).json(groupedData);
        } catch (error) {
            return res.status(500).json({ error: `Error fetching data: ${error.message}` });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
