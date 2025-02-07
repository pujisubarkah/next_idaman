import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    const { peg_id } = req.query;

    try {
        // Handle GET request
        if (req.method === 'GET') {
            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

        // Query dengan join antar tabel spg_riwayat dan spg_pegawai, serta filter berdasarkan peg_id dan riw_status
        const { data, error } = await supabase
            .schema('siap') // Jika skema default adalah public, hapus baris ini
            .from('spg_riwayat_prestasi_pribadi')
            .select('*')
            .eq('peg_id', peg_id) // Filter berdasarkan peg_id
           

            if (error) {
                console.error("Error fetching data:", error);
                return res.status(500).json({ error: error.message });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given peg_id" });
            }

            return res.status(200).json(data);
        }
// Handle POST request
if (req.method === 'POST') {
    const {
        peg_id,
        nama_penghargaan,
        tahun,
        peran,
        tingkat,
        instansi_pemberi
    } = req.body;

    if (!peg_id || !nama_penghargaan) {
        return res.status(400).json({ error: "Missing required fields" });
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
