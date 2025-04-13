import { supabase } from '../../../../lib/supabaseClient'; // Pastikan pathnya benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log('Request received at /api/permohonan'); // Log untuk debugging

    try {
      // Mengambil semua data `nama_editor`
      const { data: editorData, error: editorError } = await supabase
        .schema('siap_skpd')
        .from('view_status_edit_pegawai')
        .select('nama_editor')
        .neq('nama_editor', null); // Pastikan hanya nilai valid yang dihitung

      if (editorError) {
        console.error('Error fetching nama_editor:', editorError);
        return res.status(500).json({ error: editorError.message });
      }

      // Melakukan grouping nama_editor
      const groupedEditors = editorData.reduce((acc, curr) => {
        if (!acc[curr.nama_editor]) {
          acc[curr.nama_editor] = 0;
        }
        acc[curr.nama_editor]++;
        return acc;
      }, {});

      // Mengubah hasil menjadi array
      const groupedArray = Object.entries(groupedEditors).map(([editor, count]) => ({
        nama_editor: editor,
        total_count: count,
      }));

      // Mengembalikan data yang sudah digroup
      return res.status(200).json({
        groupedEditors: groupedArray,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Jika method yang digunakan selain GET, kembalikan status 405
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
