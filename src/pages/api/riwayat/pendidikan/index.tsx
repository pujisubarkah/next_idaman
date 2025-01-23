import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import  
  
export default async function handler(req, res) {  
    if (req.method === 'POST') {  
        try {  
            const { jenis, nama, tanggalMulai, tanggalSelesai, nomorsurat, instansi, jumlahJam } = req.body;  
  
            // Validasi data yang diterima  
            if (!jenis || !nama || !tanggalMulai || !tanggalSelesai || !nomorsurat || !instansi || !jumlahJam) {  
                return res.status(400).json({ error: "Semua field harus diisi." });  
            }  
  
            // Simpan data ke dalam database  
            const { data, error } = await supabase  
                .schema('siap_skpd')  
                .from('spg_riwayat_pendidikan')  
                .insert([  
                    { jenis, nama, tanggalMulai, tanggalSelesai, nomorsurat, instansi, jumlahJam }  
                ]);  
  
            if (error) {  
                console.error("Error inserting data:", error.message);  
                return res.status(500).json({ error: error.message });  
            }  
  
            return res.status(201).json(data);  
        } catch (error) {  
            console.error("Error in handler:", error.message);  
            return res.status(500).json({ error: error.message });  
        }  
    }  
  
    // Tangani permintaan GET  
    if (req.method === 'GET') {  
        try {  
            // Ambil parameter peg_id dari query  
            const { peg_id } = req.query;  
  
            // Validasi parameter peg_id  
            if (!peg_id) {  
                return res.status(400).json({ error: "'peg_id' parameter is required" });  
            }  
  
            // Ambil data riwayat pendidikan berdasarkan peg_id  
            const { data: riwayatPendidikan, error: riwayatError } = await supabase  
                .schema('siap_skpd')  
                .from('spg_riwayat_pendidikan')  
                .select(`*`)  
                .eq('peg_id', peg_id)  
                .order('tingpend_id', { ascending: true });  
  
            // Tangani error dari Supabase  
            if (riwayatError) {  
                console.error("Error fetching riwayat pendidikan from Supabase:", riwayatError.message);  
                return res.status(500).json({ error: riwayatError.message });  
            }  
  
            // Fetch data tingkat pendidikan  
            const { data: tingpend, error: tingpendError } = await supabase  
                .schema('siap')  
                .from('m_spg_tingkat_pendidikan')  
                .select('tingpend_id, nm_tingpend');  
  
            // Tangani error dari Supabase  
            if (tingpendError) {  
                console.error("Error fetching tingkat pendidikan from Supabase:", tingpendError.message);  
                return res.status(500).json({ error: tingpendError.message });  
            }  
  
            // Fetch data jurusan  
            const { data: jurusan, error: jurusanError } = await supabase  
                .schema('siap')  
                .from('m_spg_jurusan')  
                .select('jurusan_id, jurusan_nm');  
  
            // Tangani error dari Supabase  
            if (jurusanError) {  
                console.error("Error fetching jurusan from Supabase:", jurusanError.message);  
                return res.status(500).json({ error: jurusanError.message });  
            }  
  
            // Fetch data universitas  
            const { data: universitas, error: universitasError } = await supabase  
                .schema('siap')  
                .from('m_spg_universitas')  
                .select('univ_id, univ_nmpti');  
  
            // Tangani error dari Supabase  
            if (universitasError) {  
                console.error("Error fetching universitas from Supabase:", universitasError.message);  
                return res.status(500).json({ error: universitasError.message });  
            }  
  
            // Fetch data pendidikan  
            const { data: pendidikan, error: pendidikanError } = await supabase  
                .schema('siap')  
                .from('m_spg_pendidikan')  
                .select('id_pend, nm_pend');  
  
            // Tangani error dari Supabase  
            if (pendidikanError) {  
                console.error("Error fetching pendidikan from Supabase:", pendidikanError.message);  
                return res.status(500).json({ error: pendidikanError.message });  
            }  
  
            // Cek apakah data riwayat pendidikan ditemukan  
            if (!riwayatPendidikan || riwayatPendidikan.length === 0) {  
                return res.status(404).json({ error: "No data found for the given peg_id" });  
            }  
  
            // Gabungkan data riwayat pendidikan dengan data tingkat pendidikan  
            const combinedData = riwayatPendidikan.map(item => {  
                const tingpendItem = tingpend.find(t => t.tingpend_id === item.tingpend_id);  
                const jurusanItem = jurusan.find(u => u.jurusan_id === item.jurusan_id);  
                const univItem = universitas.find(u => u.univ_id === item.univ_id);  
                const pendidikanItem = pendidikan.find(u => u.id_pend === item.id_pend);  
  
                return {  
                    ...item,  
                    nm_tingpend: tingpendItem ? tingpendItem.nm_tingpend : null,  
                    nama_jurusan: jurusanItem ? jurusanItem.jurusan_nm : null,  
                    nama_univ: univItem ? univItem.univ_nmpti : null,  
                    nama_pendidikan: pendidikanItem ? pendidikanItem.nm_pend : null  
                };  
            });  
  
            // Kirimkan data ke client  
            return res.status(200).json(combinedData);  
        } catch (error) {  
            // Tangani error jika terjadi  
            console.error("Error in handler:", error.message);  
            return res.status(500).json({ error: error.message });  
        }  
    }  
  
    // Jika metode tidak dikenali  
    return res.status(405).json({ error: "Method not allowed" });  
}  
