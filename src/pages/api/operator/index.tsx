import { supabase } from '../../../../lib/supabaseClient'; // Pastikan path benar

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log('Request received at /api/operator'); // Log untuk debugging

    try {
      // Ambil data dari tabel status_edit_pegawai_log
      const { data: logData, error: logError } = await supabase
        .schema('siap_skpd')
        .from('status_edit_pegawai_log')
        .select(`
          editor_id,
          time
        `) // Ambil editor_id dan waktu aktivitas
        .gte('time', '2024-01-01T00:00:00') // Filter untuk tahun 2024
        .lt('time', '2025-01-01T00:00:00'); // Filter untuk tahun 2024

      // Tangani error dari Supabase
      if (logError) {
        console.error('Error fetching status edit logs:', logError);
        return res.status(500).json({ error: logError.message });
      }

      // Jika tidak ada data ditemukan
      if (!logData || logData.length === 0) {
        console.log('No data found');
        return res.status(404).json({ message: 'Data not found' });
      }

      // Ambil data dari tabel users untuk mendapatkan nama berdasarkan editor_id
      const { data: usersData, error: usersError } = await supabase
        .schema('siap_skpd')
        .from('users')
        .select('id, nama'); // Ambil id dan nama editor

      // Tangani error dari Supabase
      if (usersError) {
        console.error('Error fetching users data:', usersError);
        return res.status(500).json({ error: usersError.message });
      }

      // Buat objek untuk mengelompokkan data berdasarkan editor_id
      const groupedData = logData.reduce((acc, row) => {
        // Jika editor_id belum ada di accumulator, tambahkan
        if (!acc[row.editor_id]) {
          acc[row.editor_id] = { editor_id: row.editor_id, total_activities: 0, latest_activity: null, nama: null };
        }

        // Update total_activities
        acc[row.editor_id].total_activities += 1;

        // Tentukan waktu terbaru
        if (!acc[row.editor_id].latest_activity || new Date(row.time) > new Date(acc[row.editor_id].latest_activity)) {
          acc[row.editor_id].latest_activity = row.time;
        }

        return acc;
      }, {});

      // Menggabungkan data nama editor dari usersData
      usersData.forEach(user => {
        if (groupedData[user.id]) {
          groupedData[user.id].nama = user.nama;
        }
      });

      // Convert the grouped data to an array
      const groupedDataArray = Object.values(groupedData);

      // Kembalikan data yang sudah dikelompokkan dan disertai nama editor
      return res.status(200).json({
        data: groupedDataArray,
        totalItems: groupedDataArray.length, // Hitung total item dari panjang array data
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Jika method bukan GET, kembalikan 405 (Method Not Allowed)
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
