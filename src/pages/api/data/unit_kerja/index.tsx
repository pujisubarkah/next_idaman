import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ambil data dari schema 'siap' (satuan kerja)
      const { data: satuanKerja, error: satuanError } = await supabase
        .schema('siap')
        .from('m_spg_satuan_kerja')
        .select('*')
        .order('satuan_kerja_id', { ascending: true });

      if (satuanError) throw new Error(satuanError.message);

      // Ambil data dari schema 'siap_skpd' (unit kerja dan pegawai)
      const { data: unitKerja, error: unitError } = await supabase
        .schema('siap_skpd')
        .from('m_spg_unit_kerja')
        .select(`
          *,
          spg_pegawai (peg_nama)
        `)
        .order('unit_kerja_level', { ascending: true });

      if (unitError) throw new Error(unitError.message);

      // Tipe untuk Unit Kerja
      interface Unit {
        unit_kerja_id: number;
        unit_kerja_nama: string;
        unit_kerja_parent: number | null;
        unit_kerja_level: number;
        satuan_kerja_id: number;
        pegawai_count: number;
        children: Unit[];
      }

      // Fungsi hierarki unit kerja
      const buildHierarchy = (units: Unit[]): Unit[] => {
        const unitMap: { [key: number]: Unit } = {};
        units.forEach(unit => {
          unitMap[unit.unit_kerja_id] = { ...unit, children: [] };
        });

        const result: Unit[] = [];
        units.forEach(unit => {
          if (unit.unit_kerja_id === 99) return;
          if (unit.unit_kerja_parent) {
            unitMap[unit.unit_kerja_parent]?.children.push(unitMap[unit.unit_kerja_id]);
          } else {
            result.push(unitMap[unit.unit_kerja_id]);
          }
        });

        return result.sort((a, b) => {
          if (a.unit_kerja_id === 1) return -1;
          if (b.unit_kerja_id === 1) return 1;
          return a.unit_kerja_level - b.unit_kerja_level;
        });
      };

      // Gabungkan dan strukturkan data
      const structuredData = satuanKerja
        .filter(sk => sk.satuan_kerja_id !== 99)
        .map(sk => {
          const relatedUnits = unitKerja.filter(
            unit => unit.satuan_kerja_id === sk.satuan_kerja_id && unit.unit_kerja_id !== 99
          );

          const satuanPegawaiCount = relatedUnits.reduce(
            (total, unit) => total + (unit.spg_pegawai?.length || 0),
            0
          );

          return {
            satuan_kerja_id: sk.satuan_kerja_id,
            satuan_kerja_nama: sk.satuan_kerja_nama,
            pegawai_count: satuanPegawaiCount,
            units: buildHierarchy(
              relatedUnits.map(unit => ({
                ...unit,
                pegawai_count: unit.spg_pegawai?.length || 0,
                children: []
              }))
            ),
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
