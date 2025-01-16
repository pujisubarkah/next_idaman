import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the path as necessary  
  
export default async function handler(req, res) {  
  // Handle GET request to fetch the latest record  
  if (req.method === 'GET') {  
    const { id: peg_id } = req.query;  
  
    // Validate peg_id  
    if (!peg_id) {  
      return res.status(400).json({ error: "'id' parameter is required" });  
    }  
  
    try {  
      // Fetch the latest record based on peg_id  
      const { data: lastRecord, error: fetchError } = await supabase  
        .from('spg_riwayat_pangkat') // Removed schema method, use only from  
        .select('*')  
        .eq('peg_id', peg_id)  
        .order('riw_pangkat_sktgl', { ascending: false })  
        .limit(1)  
        .single();  
  
      if (fetchError) {  
        console.error("Error fetching last record:", fetchError.message);  
        return res.status(500).json({ error: fetchError.message });  
      }  
  
      if (!lastRecord) {  
        return res.status(404).json({ error: "No records found for the given peg_id" });  
      }  
  
      // Send response with the latest record  
      return res.status(200).json({ data: lastRecord });  
    } catch (error) {  
      console.error("Error processing request:", error.message);  
      return res.status(500).json({ error: error.message });  
    }  
  }  
  
  // Handle PUT request to update the latest record  
  if (req.method === 'PUT') {  
    const { id: peg_id } = req.query;  
    const {  
      gol_id,  
      riw_pangkat_id,  
      riw_pangkat_thn,  
      riw_pangkat_bln,  
      riw_pangkat_sk,  
      riw_pangkat_sktgl,  
      riw_pangkat_pejabat,  
      riw_pangkat_tmt,  
      riw_pangkat_unit_kerja  
    } = req.body; // Get data from request body  
  
    // Validate peg_id  
    if (!peg_id) {  
      return res.status(400).json({ error: "'id' parameter is required" });  
    }  
  
    try {  
      // Fetch the latest record based on peg_id  
      const { data: lastRecord, error: fetchError } = await supabase  
        .from('spg_riwayat_pangkat') // Removed schema method, use only from  
        .select('*')  
        .eq('peg_id', peg_id)  
        .order('riw_pangkat_sktgl', { ascending: false })  
        .limit(1)  
        .single();  
  
      if (fetchError) {  
        console.error("Error fetching last record:", fetchError.message);  
        return res.status(500).json({ error: fetchError.message });  
      }  
  
      if (!lastRecord) {  
        return res.status(404).json({ error: "No records found for the given peg_id" });  
      }  
  
      // Prepare update data  
      const updateData = {  
        gol_id,  
        riw_pangkat_sktgl,  
        riw_pangkat_thn,  
        riw_pangkat_bln,  
        riw_pangkat_sk,  
        riw_pangkat_pejabat,  
        riw_pangkat_tmt,  
        riw_pangkat_unit_kerja  
      };  
  
      // Update the latest record  
      const { data: updatedRecord, error: updateError } = await supabase  
        .from('spg_riwayat_pangkat') // Removed schema method, use only from  
        .update(updateData)  
        .eq('riw_pangkat_id', lastRecord.riw_pangkat_id) // Use primary key or identifier that is appropriate  
        .select('*')  
        .single();  
  
      if (updateError) {  
        console.error("Error updating record:", updateError.message);  
        return res.status(500).json({ error: updateError.message });  
      }  
  
      // Send response  
      return res.status(200).json({ message: "Record updated successfully", data: updatedRecord });  
    } catch (error) {  
      console.error("Error processing request:", error.message);  
      return res.status(500).json({ error: error.message });  
    }  
  }  
  
  // Handle unsupported methods  
  return res.status(405).json({ error: "Method not allowed" });  
}  
