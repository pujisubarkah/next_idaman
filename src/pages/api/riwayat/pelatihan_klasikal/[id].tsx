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
                .schema('siap_skpd')
                .from('spg_riwayat_nonformal')
                .select('*')
                .eq('non_id', id) // Menggunakan 'id' sebagai parameter pencarian
                .single(); // Ambil satu data

            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: "No data found for the given id" });
            }

            return res.status(200).json(data);
        }

        if (req.method === 'PUT') {
            // API PUT: Update data berdasarkan id
            const {
                non_id,
                jenis_pelatihan,
                non_nama,
                non_tgl_mulai,
                non_tgl_selesai,
                non_sttp,
                non_penyelenggara,
                diklat_jumlah_jam,
                // Tambahkan field lain yang akan diedit
            } = req.body;

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_nonformal')
                .update({
                    non_id,
                    jenis_pelatihan,
                    non_tgl_mulai,
                    non_tgl_selesai,
                    non_sttp,
                    non_penyelenggara,
                    diklat_jumlah_jam,
                    
                    // Tambahkan field lain yang ingin diperbarui
                })
                .eq('non_id', id); // Update berdasarkan 'id'

            if (error) throw error;

            return res.status(200).json({ message: 'Data successfully updated', data });
        }

        if (req.method === 'DELETE') {
            // API DELETE: Hapus data berdasarkan id
            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_nonformal')
                .delete()
                .eq('non_id', id); // Hapus berdasarkan 'id'

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
