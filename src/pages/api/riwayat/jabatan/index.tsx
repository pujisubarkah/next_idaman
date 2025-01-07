import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        // Ambil parameter peg_id dari query
        const { peg_id } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        // Fetch data dari tabel spg_riwayat_jabatan
        const { data, error } = await supabase
            .schema('siap_skpd')
            .from('spg_riwayat_jabatan')
            .select(`*`)
            .eq('peg_id', peg_id)
            .order('riw_jabatan_tgl', { ascending: true });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No data found for the given peg_id" });
        }

        // Fetch data dari tabel m_spg_golongan
        const { data: golonganData, error: golonganError } = await supabase
            .schema('siap')
            .from('m_spg_golongan')
            .select('gol_id, nm_gol');

        // Tangani error dari Supabase
        if (golonganError) {
            console.error("Error fetching golongan data:", golonganError.message);
            return res.status(500).json({ error: golonganError.message });
        }

        // Fetch data dari tabel m_spg_golongan
        const { data: eselonData, error: eselonError } = await supabase
            .schema('siap')
            .from('m_spg_eselon')
            .select('eselon_id, eselon_nm');

        // Tangani error dari Supabase
        if (eselonError) {
            console.error("Error fetching golongan data:", eselonError.message);
            return res.status(500).json({ error: eselonError.message });
        }


        // Fetch data dari tabel m_spg_unit_kerja
        const { data: unitkerjaData, error: unitkerjaError } = await supabase
            .schema('siap')
            .from('m_spg_unit_kerja')
            .select('unit_kerja_id, unit_kerja_nama, unit_kerja_parent');

        // Tangani error dari Supabase
        if (unitkerjaError) {
            console.error("Error fetching unit kerja data:", unitkerjaError.message);
            return res.status(500).json({ error: unitkerjaError.message });
        }

        // Buat mapping untuk unit kerja
        const unitkerjaMap = {};
        const parentMap = {};

        // Pertama, buat mapping untuk unit kerja dan orang tua mereka
        unitkerjaData?.forEach(unit => {
            unitkerjaMap[unit.unit_kerja_id] = unit.unit_kerja_nama;
            if (unit.unit_kerja_parent) {
                parentMap[unit.unit_kerja_id] = unit.unit_kerja_parent;
            }
        });

        // Gabungkan nama orang tua dan anak
        const combinedUnitKerjaNames = {};
        unitkerjaData?.forEach(unit => {
            if (unit.unit_kerja_parent) {
                const parentName = unitkerjaMap[unit.unit_kerja_parent] || '';
                const childName = unitkerjaMap[unit.unit_kerja_id] || '';
                combinedUnitKerjaNames[unit.unit_kerja_id] = `${parentName} - ${childName}`.trim();
            } else {
                combinedUnitKerjaNames[unit.unit_kerja_id] = unitkerjaMap[unit.unit_kerja_id];
            }
        });

        // Gabungkan data dari ketiga tabel
        const responseData = data.map(item => {
            const golongan = golonganData.find(g => g.gol_id === item.gol_id); // Pastikan menggunakan gol_id dari data
            const unitKerjaName = combinedUnitKerjaNames[item.unit_kerja_id] || null; // Ambil nama unit kerja
            const eselon = eselonData.find(e => e.eselon_id === item.eselon_id); // Pastikan menggunakan eselon_id dari data

            return {
                ...item,
                nama_golongan: golongan?.nm_gol || null, // Gunakan optional chaining
                nama_unit_kerja: unitKerjaName, // Tambahkan nama unit kerja
                nama_eselon: eselon?.eselon_nm || null // Gunakan optional chaining
            };
        });

        // Kirimkan data yang sudah digabungkan ke client
        res.status(200).json(responseData);
    } catch (error) {
        // Tangani error jika terjadi
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: error.message });
    }
}