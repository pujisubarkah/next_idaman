import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    const { id } = req.query; // Ambil id dari query

    if (req.method === 'PUT') {
        try {
            // Ambil data dari body permintaan
            const {
                peg_id,
                penghargaan_id,
                riw_penghargaan_pejabat,
                riw_penghargaan_instansi,
                riw_penghargaan_thn,
                riw_penghargaan_sk,
                riw_penghargaan_tglsk,
                riw_penghargaan_jabatan,
                riw_penghargaan_lokasi
            } = req.body;

            // Validasi data yang diterima
            if (!id || !peg_id) {
                return res.status(400).json({ error: "id and peg_id are required" });
            }

            // Memperbarui data di tabel spg_riwayat_penghargaan
            const { data, error } = await supabase
                .schema('siap_skpd') // Menyesuaikan skema
                .from('spg_riwayat_penghargaan') // Menyesuaikan tabel
                .update({
                    peg_id,
                    penghargaan_id,
                    riw_penghargaan_pejabat,
                    riw_penghargaan_instansi,
                    riw_penghargaan_thn,
                    riw_penghargaan_sk,
                    riw_penghargaan_tglsk,
                    riw_penghargaan_jabatan,
                    riw_penghargaan_lokasi
                })
                .eq('riw_penghargaan_id', id); // Menggunakan id untuk mencari data yang akan diperbarui

            if (error) throw error;

            // Kirimkan data yang diperbarui ke client
            res.status(200).json(data);
        } catch (error) {
            console.error("Error updating data:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            // Validasi id
            if (!id) {
                return res.status(400).json({ error: "'id' parameter is required" });
            }

            // Menghapus data dari tabel spg_riwayat_penghargaan
            const { data, error } = await supabase
                .schema('siap_skpd') // Menyesuaikan skema
                .from('spg_riwayat_penghargaan') // Menyesuaikan tabel
                .delete()
                .eq('riw_penghargaan_id', id); // Menggunakan id untuk mencari data yang akan dihapus

            if (error) throw error;

            // Kirimkan konfirmasi penghapusan ke client
            res.status(204).json({ message: "Data deleted successfully" });
        } catch (error) {
            console.error("Error deleting data:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        // Jika metode bukan PUT atau DELETE
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}