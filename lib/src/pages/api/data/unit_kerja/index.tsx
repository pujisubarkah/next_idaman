import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Mengambil data dari m_spg_satuan_kerja, m_spg_unit_kerja, dan spg_pegawai
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
            unit_kerja_level,
            spg_pegawai (peg_nama)
          ),
          spg_pegawai (peg_nama)
        `)
        .order('unit_kerja_level', { foreignTable: 'm_spg_unit_kerja', ascending: true }) // Mengurutkan berdasarkan unit_kerja_level
        .order('satuan_kerja_id', { ascending: true }); // Mengurutkan berdasarkan satuan_kerja_id

      if (error) {
        throw new Error(error.message);
      }

      // Interface untuk unit kerja
      interface Unit {
        unit_kerja_id: number;
        unit_kerja_nama: string;
        unit_kerja_parent: number | null;
        unit_kerja_level: number;
        pegawai_count: number;  // Jumlah pegawai di unit kerja
        children: Unit[];
      }

      // Fungsi untuk membangun hierarki unit kerja
      const buildHierarchy = (units: Unit[]): Unit[] => {
        const unitMap: { [key: number]: Unit } = {};

        // Membuat map berdasarkan unit_kerja_id untuk referensi cepat
        units.forEach(unit => {
          unitMap[unit.unit_kerja_id] = { ...unit, children: [] };
        });

        // Menyusun hierarki dengan mencocokkan parent ke unit yang sesuai
        const result: Unit[] = [];

        units.forEach(unit => {
          // Skip unit kerja dengan unit_kerja_id = 99
          if (unit.unit_kerja_id === 99) {
            return;
          }
          
          if (unit.unit_kerja_parent) {
            // Jika ada parent, tambahkan ke children dari unit_kerja_parent
            unitMap[unit.unit_kerja_parent]?.children.push(unitMap[unit.unit_kerja_id]);
          } else {
            // Jika tidak ada parent, masukkan ke dalam root level
            result.push(unitMap[unit.unit_kerja_id]);
          }
        });

        // Sortir untuk memastikan unit_kerja_id = 1 berada di atas
        const sortedResult = result.sort((a, b) => {
          if (a.unit_kerja_id === 1) return -1;  // Menempatkan unit_kerja_id = 1 di atas
          if (b.unit_kerja_id === 1) return 1;

          // Urutkan berdasarkan unit_kerja_level setelahnya
          return a.unit_kerja_level - b.unit_kerja_level;
        });

        return sortedResult;
      };

      // Menyusun data satuan kerja dan unit kerja, serta menghitung jumlah pegawai
      const structuredData = data
        .filter(satuan => satuan.satuan_kerja_id !== 99)  // Filter satuan_kerja_id = 99
        .map((satuan) => {
          // Menghitung jumlah pegawai di satuan kerja
          const satuanPegawaiCount = satuan.spg_pegawai ? satuan.spg_pegawai.length : 0;

          return {
            satuan_kerja_id: satuan.satuan_kerja_id,
            satuan_kerja_nama: satuan.satuan_kerja_nama,
            units: buildHierarchy(
              satuan.m_spg_unit_kerja.map(unit => ({
                ...unit,
                pegawai_count: unit.spg_pegawai ? unit.spg_pegawai.length : 0, // Jumlah pegawai per unit kerja
                children: []
              }))
            ),
            pegawai_count: satuanPegawaiCount, // Menambahkan jumlah pegawai di tingkat satuan kerja
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
