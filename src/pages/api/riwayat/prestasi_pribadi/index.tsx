import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return getPrestasi(req, res);
    } else if (req.method === 'POST') {
        return addPrestasi(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

// GET: Ambil data berdasarkan peg_id
async function getPrestasi(req, res) {
    try {
        const { peg_id } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        const { data, error } = await supabase
            .schema('siap') // Hapus jika skema default adalah public
            .from('spg_riwayat_prestasi_pribadi')
            .select('prestasi_pribadi_id, nama_penghargaan, tahun, tingkat, instansi_pemberi, peg_id')
            .eq('peg_id', peg_id);

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ error: "No data found for the given parameters" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST: Tambah data baru ke tabel spg_riwayat_prestasi_pribadi
async function addPrestasi(req, res) {
    try {
        const { nama_penghargaan, tahun, tingkat, instansi_pemberi, peg_id } = req.body;

        if (!nama_penghargaan || !tahun || !tingkat || !instansi_pemberi || !peg_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const { data, error } = await supabase
            .schema('siap') // Hapus jika skema default adalah public
            .from('spg_riwayat_prestasi_pribadi')
            .insert([{ nama_penghargaan, tahun, tingkat, instansi_pemberi, peg_id }])
            .select();

        if (error) throw error;

        res.status(201).json({ message: "Prestasi berhasil ditambahkan", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
