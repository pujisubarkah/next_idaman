import { supabase } from '../../../../../lib/supabaseClient'; // Adjust the import path  
  
export default async function handler(req, res) {  
    try {  
        // Get peg_id from query parameters  
        const { peg_id } = req.query;  
  
        if (!peg_id) {  
            return res.status(400).json({ error: "'peg_id' parameter is required" });  
        }  
  
        // Fetch leave history data  
        const { data, error } = await supabase  
            .schema('siap_skpd')  
            .from('spg_riwayat_cuti')  
            .select('*')  
            .eq('peg_id', peg_id)  
            .order('cuti_mulai', { ascending: false });  
  
        if (error) {  
            throw error;  
        }  
  
        if (!data || data.length === 0) {  
            return res.status(404).json({ error: "No data found for the given peg_id" });  
        }  
  
        // Fetch pegawai data  
        const { data: pegawaiData, error: pegawaiError } = await supabase  
            .schema('siap_skpd')  
            .from('spg_pegawai')  
            .select('peg_nip, peg_nama');  
  
        if (pegawaiError) {  
            throw pegawaiError;  
        }  
  
         // Fetch pegawai data  
         const { data: jeniscutiData, error: jeniscutiError } = await supabase  
         .schema('siap')  
         .from('m_spg_jenis_cuti')  
         .select('jeniscuti_id, jeniscuti_nm');  

     if (jeniscutiError) {  
         throw jeniscutiError;  
     }  





        // Create a mapping of pegawai by nip for easy lookup  
        const pegawaiMap = {};  
        pegawaiData.forEach(pegawai => {  
            pegawaiMap[pegawai.peg_nip] = pegawai.peg_nama; // Store peg_nama instead of peg_nip  
            
        });  


        // Create a mapping of pegawai by jenis cuti for easy lookup  
        const jeniscutiMap = {};  
        jeniscutiData.forEach(jeniscuti => {  
            jeniscutiMap[jeniscuti.jeniscuti_id] = jeniscuti.jeniscuti_nm; // Store peg_nama instead of peg_nip  
            
        });  
  
        // Combine the data with names  
        const combinedData = data.map(cuti => {  
            return {  
                ...cuti,  
                diketahui_nama: pegawaiMap[cuti.diketahui] || null, // Get name for diketahui  
                disetujui_nama: pegawaiMap[cuti.approve_by] || null, // Get name for approve_by  
                entry_nama: pegawaiMap[cuti.entry_by] || null, // Get name for entry_by  
                jeniscuti_nama: jeniscutiMap[cuti.jeniscuti_id] || null, // Get name for jeniscuti_id
            };  
        });  
  
        // Send the combined data to the client  
        res.status(200).json(combinedData); // Return combinedData instead of data  
    } catch (error) {  
        // Handle any errors that occur  
        console.error("Error fetching data:", error.message);  
        res.status(500).json({ error: error.message });  
    }  
}  
