import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly  
  
export default async function handler(req, res) {  
  if (req.method === 'GET') {  
    try {  
      // Fetch data from m_spg_satuan_kerja  
      const { data: satuanKerjaData, error: satuanKerjaError } = await supabase  
        .schema('siap') // Ensure the schema is correct  
        .from('m_spg_satuan_kerja') // Ensure the table name is correct  
        .select('satuan_kerja_id, satuan_kerja_nama');  
  
      if (satuanKerjaError) throw satuanKerjaError;  
  
      // Fetch data from m_spg_unit_kerja  
      const { data: unitKerjaData, error: unitKerjaError } = await supabase  
        .schema('siap') // Ensure the schema is correct  
        .from('m_spg_unit_kerja') // Ensure the table name is correct  
        .select('unit_kerja_id, unit_kerja_parent, unit_kerja_level, unit_kerja_nama, satuan_kerja_id');  
  
      if (unitKerjaError) throw unitKerjaError;  
  
      // Fetch data from m_spg_jabatan  
      const { data: jabatanData, error: jabatanError } = await supabase  
        .schema('siap_skpd') // Ensure the schema is correct  
        .from('m_spg_jabatan') // Ensure the table name is correct  
        .select('jabatan_id, jabatan_jenis, jabatan_nama, satuan_kerja_id, unit_kerja_id');  
  
      if (jabatanError) throw jabatanError;  
  
      // Create a mapping of unit kerja IDs to their names  
      const unitKerjaMap = unitKerjaData.reduce((acc, unit) => {  
        acc[unit.unit_kerja_id] = unit.unit_kerja_nama;  
        return acc;  
      }, {});  
  
      // Create a mapping of jabatan to their corresponding unit kerja  
      const jabatanMap = jabatanData.reduce((acc, jabatan) => {  
        const key = `${jabatan.unit_kerja_id}-${jabatan.unit_kerja_id}`; // Create a unique key  
        if (!acc[key]) {  
          acc[key] = [];  
        }  
        acc[key].push({  
          jabatan_id: jabatan.jabatan_id,  
          jabatan_jenis: jabatan.jabatan_jenis,  
          jabatan_nama: jabatan.jabatan_nama,  
        });  
        return acc;  
      }, {});  
  
      // Create a mapping for jabatan_jenis to jabatan_jenis_nama  
      const jabatanJenisMap = {  
        2: 'Struktural',  
        3: 'Fungsional Tertentu',  
        4: 'Fungsional Umum',  
      };  
  
      // Create a nested structure based on satuan_kerja_id, unit_kerja_parent, and unit_kerja_id  
      const structuredData = satuanKerjaData.map(satuan => {  
        // Find corresponding unit kerja entries  
        const units = unitKerjaData.filter(unit => unit.satuan_kerja_id === satuan.satuan_kerja_id);  
  
        // Create a hierarchy for units based on unit_kerja_parent  
        const unitHierarchy = units.reduce((acc, unit) => {  
          const parentId = unit.unit_kerja_parent || 'root'; // Use 'root' for top-level units  
  
          // Initialize parent if it doesn't exist  
          if (!acc[parentId]) {  
            acc[parentId] = {  
              unit_kerja_id: parentId,  
              unit_kerja_nama: parentId === 'root' ? 'Top Level' : unitKerjaMap[parentId],  
              children: [],  
            };  
          }  
  
          // Create the full name for the unit  
          const parentName = unitKerjaMap[unit.unit_kerja_parent] || ''; // Get parent name  
          const fullUnitName = parentName ? `${parentName} - ${unit.unit_kerja_nama}` : unit.unit_kerja_nama;  
  
          // Push the current unit to its parent's children  
          const jabatanEntries = jabatanMap[`${unit.unit_kerja_id}-${satuan.satuan_kerja_id}`] || [];  
          const jabatanGrouped = jabatanEntries.reduce((grouped, jabatan) => {  
            const jenisNama = jabatanJenisMap[jabatan.jabatan_jenis] || 'Unknown';  
            if (!grouped[jenisNama]) {  
              grouped[jenisNama] = [];  
            }  
            grouped[jenisNama].push({  
              jabatan_jenis: jabatan.jabatan_jenis,  
              jabatan_nama: jabatan.jabatan_nama,  
            });  
            return grouped;  
          }, {});  
  
          acc[parentId].children.push({  
            unit_kerja_id: unit.unit_kerja_id,  
            unit_kerja_nama: fullUnitName, // Use the full name here  
            unit_kerja_level: unit.unit_kerja_level,  
            satuan_kerja_id: unit.satuan_kerja_id,  
            jabatan: jabatanGrouped,  
          });  
  
          return acc;  
        }, {});  
  
        // Convert the hierarchy object to an array and sort by level  
        const unitHierarchyArray = Object.values(unitHierarchy).map((parent: any) => ({  
          ...(typeof parent === 'object' ? parent : {}),  
          children: parent.children.sort((a, b) => a.unit_kerja_level - b.unit_kerja_level), // Sort children by level  
        }));  
  
        return {  
          ...satuan,  
          units: unitHierarchyArray, // Add the hierarchical units to the satuan kerja entry  
        };  
      });  
  
      // Send the structured data in the response  
      return res.status(200).json(structuredData); // Return structured data  
    } catch (error) {  
      // Return an error response if the data fetching fails  
      return res.status(500).json({ message: 'Error fetching data', error: error.message });  
    }  
  } else {  
    // Return method not allowed if not GET  
    return res.status(405).json({ message: 'Method Not Allowed' });  
  }  
}  

