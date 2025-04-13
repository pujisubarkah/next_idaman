// pages/api/kinerja/publikasi.js

import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import

export default async function handler(req, res) {
    const { peg_id } = req.query;

    try {
        // Handle GET request
        if (req.method === 'GET') {
            if (!peg_id) {
                return res.status(400).json({ error: "'peg_id' parameter is required" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_publikasi')
                .select('*')
                .eq('peg_id', peg_id);

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
                judul,
                penerbit,
                tahun_terbit,
                level_penerbit,
                link_publikasi
            } = req.body;

            if (!peg_id || !judul || !penerbit || !tahun_terbit || !level_penerbit || !link_publikasi) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const { data, error } = await supabase
                .schema('siap_skpd')
                .from('spg_riwayat_publikasi')
                .insert([{
                    peg_id,
                    judul,
                    penerbit,
                    tahun_terbit,
                    level_penerbit,
                    link_publikasi
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

