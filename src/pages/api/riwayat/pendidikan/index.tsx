import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the import path

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract data from the request body
            const { peg_id, tingpend_id, jurusan_id, univ_id, tahun_lulus, ipk, no_ijazah, tingkat_pendidikan, jurusan, universitas } = req.body;

            // Validate required fields
            if (!peg_id || !tingpend_id || !jurusan_id || !univ_id || !tahun_lulus) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Validate master data
            if (!tingkat_pendidikan || !tingkat_pendidikan.tingpend_id || !tingkat_pendidikan.nm_tingpend) {
                return res.status(400).json({ error: "Invalid tingkat pendidikan data" });
            }
            if (!jurusan || !jurusan.jurusan_id || !jurusan.jurusan_nm) {
                return res.status(400).json({ error: "Invalid jurusan data" });
            }
            if (!universitas || !universitas.univ_id || !universitas.univ_nmpti) {
                return res.status(400).json({ error: "Invalid universitas data" });
            }

            // Insert or update data in the spg_riwayat_pendidikan table
            const { data: riwayatPendidikan, error: riwayatError } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_pendidikan')
                .upsert([
                    {
                        peg_id,
                        tingpend_id,
                        jurusan_id,
                        univ_id,
                        tahun_lulus,
                        ipk,
                        no_ijazah,
                    },
                ])
                .select('*');

            // Handle error from Supabase
            if (riwayatError) {
                console.error("Error inserting/updating riwayat pendidikan in Supabase:", riwayatError.message);
                return res.status(500).json({ error: riwayatError.message });
            }

            // Send the inserted/updated data back to the client
            return res.status(201).json({ message: "Data inserted/updated successfully", data: riwayatPendidikan });
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error in POST handler:", error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // Handle GET request
    if (req.method === 'GET') {
        try {
            // Get peg_id from query
            const { peg_id } = req.query;

            // Validate peg_id parameter
            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            // Fetch data riwayat pendidikan based on peg_id
            const { data: riwayatPendidikan, error: riwayatError } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_pendidikan')
                .select('*')
                .eq('peg_id', peg_id)
                .order('tingpend_id', { ascending: true });

            // Handle error from Supabase
            if (riwayatError) {
                console.error("Error fetching riwayat pendidikan from Supabase:", riwayatError.message);
                return res.status(500).json({ error: riwayatError.message });
            }

            // Fetch data tingkat pendidikan
            const { data: tingpend, error: tingpendError } = await supabase
                .schema('siap')
                .from('m_spg_tingkat_pendidikan')
                .select('tingpend_id, nm_tingpend');

            // Handle error from Supabase
            if (tingpendError) {
                console.error("Error fetching tingkat pendidikan from Supabase:", tingpendError.message);
                return res.status(500).json({ error: tingpendError.message });
            }

            // Fetch data jurusan
            const { data: jurusan, error: jurusanError } = await supabase
                .schema('siap')
                .from('m_spg_jurusan')
                .select('jurusan_id, jurusan_nm');

            // Handle error from Supabase
            if (jurusanError) {
                console.error("Error fetching jurusan from Supabase:", jurusanError.message);
                return res.status(500).json({ error: jurusanError.message });
            }

            // Fetch data universitas
            const { data: universitas, error: universitasError } = await supabase
                .schema('siap')
                .from('m_spg_universitas')
                .select('univ_id, univ_nmpti');

            // Handle error from Supabase
            if (universitasError) {
                console.error("Error fetching universitas from Supabase:", universitasError.message);
                return res.status(500).json({ error: universitasError.message });
            }

            // Fetch data pendidikan
            const { data: pendidikan, error: pendidikanError } = await supabase
                .schema('siap')
                .from('m_spg_pendidikan')
                .select('id_pend, nm_pend');

            // Handle error from Supabase
            if (pendidikanError) {
                console.error("Error fetching pendidikan from Supabase:", pendidikanError.message);
                return res.status(500).json({ error: pendidikanError.message });
            }

            // Check if riwayat pendidikan data is found
            if (!riwayatPendidikan || riwayatPendidikan.length === 0) {
                return res.status(404).json({ error: "No data found for the given peg_id" });
            }

            // Log the fetched data for debugging
            console.log("Riwayat Pendidikan:", riwayatPendidikan);
            console.log("Universitas Data:", universitas);

            // Combine data riwayat pendidikan with other data
            const combinedData = riwayatPendidikan.map(item => {
                const tingpendItem = tingpend.find(t => t.tingpend_id === item.tingpend_id);
                const jurusanItem = jurusan.find(u => u.jurusan_id === item.jurusan_id);
                const univItem = universitas.find(u => u.univ_id === item.univ_id);

                // Log the IDs for debugging
                console.log(`Item Univ ID: ${item.univ_id}, Found Univ: ${univItem ? univItem.univ_nmpti : 'Not Found'}`);

                return {
                    ...item,
                    nm_tingpend: tingpendItem ? tingpendItem.nm_tingpend : null,
                    nama_jurusan: jurusanItem ? jurusanItem.jurusan_nm : null,
                    nama_univ: univItem ? univItem.univ_nmpti : null,
                };
            });

            // Send combined data to client
            return res.status(200).json(combinedData);
        } catch (error) {
            // Handle error if it occurs
            console.error("Error in handler:", error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // If method is not allowed
    return res.status(405).json({ error: "Method not allowed" });
}
