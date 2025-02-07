import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
<<<<<<< HEAD
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

=======
    const { peg_id } = req.query;

    try {
        // Handle GET request
        if (req.method === 'GET') {
            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

        // Query dengan join antar tabel spg_riwayat dan spg_pegawai, serta filter berdasarkan peg_id dan riw_status
>>>>>>> 30f6765d1db69bcd62b78e99b65c87f49eb5c903
        const { data, error } = await supabase
            .schema('siap') // Hapus jika skema default adalah public
            .from('spg_riwayat_prestasi_pribadi')
<<<<<<< HEAD
            .select('prestasi_pribadi_id, nama_penghargaan, tahun, tingkat, instansi_pemberi, peg_id')
            .eq('peg_id', peg_id);

        if (error) throw error;
=======
            .select('*')
            .eq('peg_id', peg_id) // Filter berdasarkan peg_id
           

            if (error) {
                console.error("Error fetching data:", error);
                return res.status(500).json({ error: error.message });
            }
>>>>>>> 30f6765d1db69bcd62b78e99b65c87f49eb5c903

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given peg_id" });
            }

<<<<<<< HEAD
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
=======
            return res.status(200).json(data);
        }
// Handle POST request
if (req.method === 'POST') {
    const {
        peg_id,
        nama_penghargaan,
        tahun,
        tingkat,
        instansi_pemberi
    } = req.body;

    if (!peg_id || !nama_penghargaan) {
        return res.status(400).json({ error: "Missing required fields" });
>>>>>>> 30f6765d1db69bcd62b78e99b65c87f49eb5c903
    }

    const { data, error } = await supabase
        .schema('siap')
        .from('spg_riwayat_prestasi_pribadi')
        .insert([{
            peg_id,
            nama_penghargaan,
            tahun,
            tingkat,
            instansi_pemberi
        }]);

    if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
        message: "Data successfully added",
        data
    });
}

// Handle unsupported methods
res.setHeader('Allow', ['GET', 'POST']);
return res.status(405).json({ error: `Method ${req.method} not allowed` });
} catch (error) {
console.error("Error in handler:", error);
return res.status(500).json({ error: error.message });
}
}
