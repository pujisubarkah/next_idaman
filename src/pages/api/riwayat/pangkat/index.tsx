import { supabase } from '../../../../../lib/supabaseClient'; // Adjust import path

export default async function handler(req, res) {
    try {
        // Get peg_id from query parameters
        const { peg_id } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        // Query to fetch data from spg_riwayat_pangkat table
        const { data: riwayatPangkatData, error: riwayatPangkatError } = await supabase
            .schema('siap_skpd')
            .from('spg_riwayat_pangkat')
            .select('*')
            .eq('peg_id', peg_id) // Use the validated integer
            .order('riw_pangkat_sktgl', { ascending: true });

        if (riwayatPangkatError) {
            throw riwayatPangkatError;
        }

        // Check if no data was found
        if (!riwayatPangkatData || riwayatPangkatData.length === 0) {
            return res.status(404).json({ error: "No data found for the given peg_id in spg_riwayat_pangkat" });
        }

        // Extract golongan_ids from riwayatPangkatData
        const golonganIds = riwayatPangkatData.map(item => item.golongan_id).filter(id => id !== undefined);

        // Fetch data from m_spg_golongan table
        const { data: golonganData, error: golonganError } = await supabase
            .schema('siap')
            .from('m_spg_golongan')
            .select('gol_id, nm_gol,nm_pkt')
            .in('gol_id', golonganIds);

        if (golonganError) {
            throw golonganError;
        }

        
        // If no golongan data found, log a warning
        if (!golonganData || golonganData.length === 0) {
            console.warn("No golongan data found for the given peg_id");
        }

        // Combine the data from both tables
        const responseData = riwayatPangkatData.map(item => {
            const golongan = golonganData.find(g => g.gol_id === item.gol_id);
            return {
                ...item,
                golongan_id: item.gol_id, // Include golongan_id
                nama_golongan: golongan?.nm_gol || null // Use optional chaining
            };
        });

        // Send the combined data to the client
        res.status(200).json(responseData);
    } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: error.message });
    }
}
