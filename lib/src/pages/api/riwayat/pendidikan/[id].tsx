import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    try {
        const { id } = req.query; // Mengambil 'id' dari query parameter

        // Validasi jika 'id' tidak disediakan
        if (!id) {
            return res.status(400).json({ error: "'id' parameter is required" });
        }

        if (req.method === 'GET') {
            // API GET: Ambil data berdasarkan id
            const { data, error } = await supabase
                .schema('siap')
                .from('spg_riwayat_pendidikan')
                .select(`
                    *,
                    m_spg_tingkat_pendidikan(nm_tingpend), m_spg_jurusan(jurusan_nm), m_spg_universitas(univ_nmpti)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: "No data found for the given id" });
            }

            return res.status(200).json(data);
        }

        if (req.method === 'PUT') {
            // API PUT: Update seluruh data berdasarkan id
            const updates = req.body; // Mengambil semua field dari body request

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: "Request body is required and should not be empty" });
            }

            const { data, error } = await supabase
                .schema('siap')
                .from('spg_riwayat_pendidikan')
                .update({ ...updates }) // Mengupdate seluruh field menggunakan spread operator
                .eq('id', id);

            if (error) throw error;

            return res.status(200).json({ message: 'Data successfully updated', data });
        }

        if (req.method === 'DELETE') {
            // API DELETE: Hapus data berdasarkan id
            const { data, error } = await supabase
                .schema('siap')
                .from('spg_riwayat_pendidikan')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return res.status(200).json({ message: 'Data successfully deleted', data });
        }

        // Jika method tidak sesuai
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (error) {
        console.error("Error processing request:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
