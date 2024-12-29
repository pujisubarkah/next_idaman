import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Mengambil data dari m_spg_satuan_kerja dan m_spg_unit_kerja
      const { data, error } = await supabase
        .schema('siap') // Ganti dengan schema yang sesuai
        .from('m_spg_satuan_kerja')
        .select(`
          satuan_kerja_id,
          satuan_kerja_nama,
          m_spg_unit_kerja (
            unit_kerja_id,
            unit_kerja_nama,
            unit_kerja_parent,
            unit_kerja_level
          )
        `)
        .order('unit_kerja_level', { foreignTable: 'm_spg_unit_kerja', ascending: true }) // Mengurutkan berdasarkan unit_kerja_level
        .order('satuan_kerja_id', { ascending: true }); // Mengurutkan berdasarkan satuan_kerja_id

      if (error) {
        throw new Error(error.message);
      }

      // Fungsi untuk membangun hierarki unit kerja
      const buildHierarchy = (units) => {
        const unitMap = {};

        // Membuat map berdasarkan unit_kerja_id untuk referensi cepat
        units.forEach(unit => {
          unitMap[unit.unit_kerja_id] = { ...unit, children: [] };
        });

        // Menyusun hierarki dengan menambahkan unit kerja anak ke parent
        const result: any[] = [];

        units.forEach(unit => {
          // Menyaring unit kerja dengan unit_kerja_id = 99
          if (unit.unit_kerja_id === 99) return;

          if (unit.unit_kerja_parent) {
            // Jika unit kerja memiliki parent, tambahkan ke children dari parent
            const parentUnit = unitMap[unit.unit_kerja_parent];
            if (parentUnit) {
              parentUnit.children.push(unitMap[unit.unit_kerja_id]);
            }
          } else {
            // Jika tidak ada parent (root), masukkan ke dalam list utama
            result.push(unitMap[unit.unit_kerja_id]);
          }
        });

        return result;
      };

      // Menyusun data satuan kerja dan unit kerja
      const structuredData = data
        .filter(satuan => satuan.satuan_kerja_id !== 99)  // Filter satuan_kerja_id = 99
        .map((satuan) => {
          return {
            satuan_kerja_id: satuan.satuan_kerja_id,
            satuan_kerja_nama: satuan.satuan_kerja_nama,
            units: buildHierarchy(satuan.m_spg_unit_kerja)
          };
        });

      return res.status(200).json(structuredData);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
