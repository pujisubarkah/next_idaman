import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path  
  
export default async function handler(req, res) {  
  // Handle GET request to fetch the latest record  
  if (req.method === 'GET') {  
    const { id: peg_id } = req.query;  
  
    // Validasi peg_id  
    if (!peg_id) {  
      return res.status(400).json({ error: "'id' parameter is required" });  
    }  
  
    try {  
      // Ambil data terakhir berdasarkan peg_id  
      const { data: lastRecord, error: fetchError } = await supabase  
        .schema('siap_skpd')  
        .from('spg_riwayat_pangkat')  
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
  
      // Kirimkan response dengan data terakhir  
      return res.status(200).json({ data: lastRecord });  
    } catch (error) {  
      console.error("Error processing request:", error.message);  
      return res.status(500).json({ error: error.message });  
    }  
  }  
  
  // Handle PUT request to update the latest record  
  if (req.method === 'PUT') {  
    const { id: peg_id } = req.query;  
    const { gol_id, riw_pangkat_thn, riw_pangkat_bln, riw_pangkat_sk, riw_pangkat_sktgl, riw_pangkat_pejabat, riw_pangkat_tmt, riw_pangkat_unit_kerja } = req.body; // Ambil data dari request body  
  
    // Validasi peg_id  
    if (!peg_id) {  
      return res.status(400).json({ error: "'id' parameter is required" });  
    }  
  
    try {  
      // Ambil data terakhir berdasarkan peg_id  
      const { data: lastRecord, error: fetchError } = await supabase  
        .schema('siap_skpd')  
        .from('spg_riwayat_pangkat')  
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
        riw_pangkat_thn,   
        riw_pangkat_bln,   
        riw_pangkat_sk,   
        riw_pangkat_pejabat,   
        riw_pangkat_tmt,    
        riw_pangkat_unit_kerja   
      };  
  
      // Update data terakhir  
      const { data: updatedRecord, error: updateError } = await supabase  
        .schema('siap_skpd')  
        .from('spg_riwayat_pangkat')  
        .update({ gol_id, riw_pangkat_sktgl, ...updateData })  
        .eq('riw_pangkat_id', lastRecord.riw_pangkat_id) // Gunakan primary key atau identifier yang sesuai  
        .select('*')  
        .single();  
  
      if (updateError) {  
        console.error("Error updating record:", updateError.message);  
        return res.status(500).json({ error: updateError.message });  
      }  
  
      // Kirimkan response  
      return res.status(200).json({ message: "Record updated successfully", data: updatedRecord });  
    } catch (error) {  
      console.error("Error processing request:", error.message);  
      return res.status(500).json({ error: error.message });  
    }  
  }  
  
  // Handle unsupported methods  
  return res.status(405).json({ error: "Method not allowed" });  
}  
