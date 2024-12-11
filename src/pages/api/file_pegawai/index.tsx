import { supabase } from '../../../../lib/supabaseClient'; // Pastikan path sudah benar

export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { page = 1, itemsPerPage = 10, parent_id, peg_id, category } = req.query;
  
      try {
        // Query utama untuk mengambil data
        let query = supabase
          .schema('siap')
          .from('m_spg_file_pegawai_ref')
          .select(`
            id,
            file_nama,
            parent_id,
            spg_file_pegawai (*)
          `, { count: 'exact' })
          .order('id', { ascending: true });
  
        // Tambahkan filter
        if (parent_id) {
          query = query.eq('parent_id', parent_id);
        }
        if (peg_id) {
          query = query.eq('peg_id', peg_id);
        }
  
        // Pagination
        const { data, error, count } = await query.range(
          (page - 1) * itemsPerPage,
          page * itemsPerPage - 1
        );
  
        if (error) {
          console.error('Error fetching data:', error);
          return res.status(500).json({ error: error.message });
        }
  
        if (!data || data.length === 0) {
          return res.status(404).json({ message: 'Data not found' });
        }
  
        // Query tambahan untuk mendapatkan parent_file_nama
        const parentIds = data.map(item => item.parent_id).filter(Boolean);
        const { data: parentData, error: parentError } = await supabase
          .schema('siap') 
          .from('m_spg_file_pegawai_ref')
          .select('id, file_nama')
          .in('id', parentIds);
  
        if (parentError) {
          console.error('Error fetching parent data:', parentError);
          return res.status(500).json({ error: parentError.message });
        }
  
        // Buat mapping parent_id ke file_nama
        const parentMap = parentData.reduce((map, parent) => {
          map[parent.id] = parent.file_nama;
          return map;
        }, {});
  
        // Format data akhir
        const formattedData = data.map(item => ({
          ...item,
          category: item.parent_id ? `Kategori: ${parentMap[item.parent_id] || 'Tidak Diketahui'}` : 'Tidak Diketahui',
          documents: item.spg_file_pegawai || [],
        }));
  
        return res.status(200).json({
          data: formattedData,
          totalItems: count || 0,
        });
      } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  }