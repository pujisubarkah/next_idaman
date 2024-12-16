import { supabase } from '../../../../lib/supabaseClient'; // Pastikan path sudah benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, itemsPerPage = 10, parent_id, peg_id } = req.query;

    try {
      // Query utama untuk mengambil data dari tabel m_spg_file_pegawai_ref
      let query = supabase
  .schema('siap')
  .from('m_spg_file_pegawai_ref')
  .select(`
    id,
    file_nama,
    parent_id,
    spg_file_pegawai:m_spg_file_pegawai_id (
      file_id,
      file_nama,
      file_lokasi,
      file_ket,
      file_tgl
    )
  `, { count: 'exact' })
  .order('id', { ascending: true });


      // Tambahkan filter berdasarkan parent_id
      if (parent_id) {
        query = query.eq('parent_id', parent_id);
      }

      // Filter berdasarkan peg_id di dalam tabel relasi spg_file_pegawai
      if (peg_id) {
        query = query.contains('spg_file_pegawai', { peg_id });
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

      // Jika ada parent_id, tambahkan kategori berdasarkan parent_id
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

      // Format data akhir menjadi struktur category dan documents
      const categorizedData = data.reduce((acc: { category: string, documents: any[] }[], item) => {
        const categoryName = item.parent_id ? parentMap[item.parent_id] || 'Tidak Diketahui' : 'Tidak Diketahui';
        const documents = (item.spg_file_pegawai || []).map(doc => ({
          id: doc.id,
          namaFile: doc.file_nama,
          fileUrl: doc.file_lokasi,
          keterangan: doc.file_ket,
          tanggalUpload: doc.file_tgl,
        }));

        // Tambahkan ke kategori
        const categoryIndex = acc.findIndex(cat => cat.category === categoryName);
        if (categoryIndex >= 0) {
          acc[categoryIndex].documents.push(...documents);
        } else {
          acc.push({
            category: categoryName,
            documents,
          });
        }

        return acc;
      }, []);

      return res.status(200).json({
        data: categorizedData,
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
