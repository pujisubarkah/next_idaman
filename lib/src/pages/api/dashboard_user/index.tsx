import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { status_id } = req.query; // Mengambil parameter status_id dari query (opsional)

        try {
            // Query ke Supabase
            let query = supabase
                .schema('siap_skpd') // Pastikan schema benar
                .from('monitoring_update_data_pegawai') // Nama tabel/view
                .select('npwp,karpeg,sk_cpns,sk_pns,rekening_bank,karis,karsu', );

      
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
