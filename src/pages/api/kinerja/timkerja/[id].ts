import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    const { id } = req.query; // Get the ID from the query parameters

    try {
        // Handle PUT request (Update)
        if (req.method === 'PUT') {
            const { timkerja_nama, timkerja_nomor, tanggal_timkerja, timkerja_penandatangan, timkerja_peran, tahun, timkerja_tingkat } = req.body;
        
            // Validate input
            if (!id || !timkerja_nama || !timkerja_nomor || !tanggal_timkerja || !tahun || !timkerja_tingkat || !timkerja_penandatangan || !timkerja_peran) {
                return res.status(400).json({
                    error: "Missing required fields: 'id', 'timkerja_nama', 'timkerja_nomor', 'tanggal_timkerja', 'timkerja_penandatangan', 'timkerja_peran', 'tahun', 'timkerja_tingkat'"
                });
            }

            const updated_at = new Date().toISOString(); // Generate current timestamp
        
            // Update data in spg_riwayat_timkerja
            const { data: updateData, error: updateError } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .update({
                    timkerja_nama,
                    timkerja_nomor,
                    tanggal_timkerja,
                    timkerja_penandatangan,
                    timkerja_peran,
                    tahun,
                    timkerja_tingkat,
                    updated_at
                })
                .eq('timkerja_id', id); // Use 'timkerja_id' to identify the record to update
        
            // Handle error from Supabase
            if (updateError) {
                console.error("Error updating data:", updateError.message);
                return res.status(500).json({ error: updateError.message });
            }
        
            // Return success message
            return res.status(200).json({
                message: "Data successfully updated in spg_riwayat_timkerja",
                data: updateData
            });
        }

        // Handle DELETE request (Hard Delete)
        if (req.method === 'DELETE') {
            // Hard delete the record
            const { data: deleteData, error: deleteError } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_timkerja')
                .delete() // Perform a hard delete
                .eq('timkerja_id', id); // Use 'timkerja_id' to identify the record to delete

            // Handle error from Supabase
            if (deleteError) {
                console.error("Error deleting data:", deleteError.message);
                return res.status(500).json({ error: deleteError.message });
            }

            // Return success message
            return res.status(200).json({
                message: "Data successfully deleted from spg_riwayat_timkerja",
                data: deleteData
            });
        }

        // If HTTP method is not allowed
        return res.status(405).json({ error: "Method not allowed" });

    } catch (error) {
        // Handle unexpected errors
        console.error("Error processing request:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}