import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { peg_id } = req.query; // Mengambil parameter peg_id dari query

        // Validasi peg_id
        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        try {
            // Query ke Supabase
            let query = supabase
                .schema('siap') // Pastikan schema benar
                .from('absen_pegawai') // Nama tabel/view
                .select('*')
                .eq('peg_id', peg_id) // Filter berdasarkan peg_id
                .gte('tanggal', '2024-01-01') // Filter untuk tahun 2024 dan seterusnya
                .lt('tanggal', '2025-01-01'); // Filter untuk tahun 2024

            const { data, error } = await query;

            // Menangani error
            if (error) {
                console.error('Error fetching data:', error);
                return res.status(500).json({ error: error.message });
            }

            // Mengembalikan data ke klien
            if (!data || data.length === 0) {
                return res.status(404).json({ message: 'No data found' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error('Unexpected error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}