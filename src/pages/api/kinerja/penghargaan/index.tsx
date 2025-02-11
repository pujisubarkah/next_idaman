import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Ambil parameter peg_id dari query
            const { peg_id } = req.query;

            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            // Fetching data from spg_riwayat_penghargaan
            const { data: penghargaanData, error: penghargaanError } = await supabase
                .schema('siap_skpd') // Menyesuaikan skema
                .from('spg_riwayat_penghargaan') // Menyesuaikan tabel
                .select(`
                    riw_penghargaan_id, penghargaan_id, riw_penghargaan_pejabat, 
                    riw_penghargaan_instansi, riw_penghargaan_thn, riw_penghargaan_sk, 
                    riw_penghargaan_tglsk, riw_penghargaan_jabatan, riw_penghargaan_lokasi
                `)
                .eq('peg_id', peg_id)
                .order('riw_penghargaan_tglsk', { ascending: true });

            if (penghargaanError) throw penghargaanError;
            if (!penghargaanData || penghargaanData.length === 0) {
                return res.status(404).json({ error: "No penghargaan data found for the given peg_id" });
            }

            // Fetching data from m_spg_penghargaan
            const { data: mPenghargaanData, error: mPenghargaanError } = await supabase
                .schema('siap') // Menyesuaikan skema
                .from('m_spg_penghargaan') // Menyesuaikan tabel
                .select('penghargaan_id, penghargaan_nm');

            if (mPenghargaanError) throw mPenghargaanError;

            // Menggabungkan data penghargaan dengan nama penghargaan dari m_spg_penghargaan
            const mergedData = penghargaanData.map(item => ({
                ...item,
                penghargaan_nm: mPenghargaanData.find(p => p.penghargaan_id === item.penghargaan_id)?.penghargaan_nm || null
            }));

            // Kirimkan data ke client
            res.status(200).json(mergedData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
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
            if (!peg_id || !penghargaan_id || !riw_penghargaan_tglsk) {
                return res.status(400).json({ error: "peg_id, penghargaan_id, and riw_penghargaan_tglsk are required" });
            }

            // Menambahkan data ke tabel spg_riwayat_penghargaan
            const { data, error } = await supabase
                .schema('siap_skpd') // Menyesuaikan skema
                .from('spg_riwayat_penghargaan') // Menyesuaikan tabel
                .insert([
                    {
                        peg_id,
                        penghargaan_id,
                        riw_penghargaan_pejabat,
                        riw_penghargaan_instansi,
                        riw_penghargaan_thn,
                        riw_penghargaan_sk,
                        riw_penghargaan_tglsk,
                        riw_penghargaan_jabatan,
                        riw_penghargaan_lokasi
                    }
                ]);

            if (error) throw error;

            // Kirimkan data yang baru ditambahkan ke client
            res.status(201).json(data);
        } catch (error) {
            console.error("Error adding data:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        // Jika metode bukan GET atau POST
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}