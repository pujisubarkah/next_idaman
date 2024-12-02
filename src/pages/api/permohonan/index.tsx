import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { status_id } = req.query; // Mengambil parameter status_id dari query

        try {
            // Validasi status_id
            if (!status_id) {
                return res.status(400).json({ error: 'status_id is required' });
            }

            // Query ke Supabase dengan filter berdasarkan status_id
            const { data, error } = await supabase
                .schema('siap_skpd') // Pastikan schema benar
                .from('view_status_edit_pegawai') // Nama tabel/view
                .select('*')
                .eq('status_id', status_id); // Filter status_id

            // Menangani error
            if (error) {
                console.error('Error fetching data:', error);
                return res.status(500).json({ error: error.message });
            }

            // Mengembalikan data ke klien
            if (!data || data.length === 0) {
                return res.status(404).json({ message: 'No data found for the given status_id' });
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
