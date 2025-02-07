<<<<<<< HEAD
import { supabase } from '../../../../../lib/supabaseClient'; // Sesuaikan path import
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "'id' parameter is required" });
    }

    switch (req.method) {
        case 'GET':
            return getPrestasiById(req, res, id as string);
        case 'PUT':
            return updatePrestasi(req, res, id as string);
        case 'DELETE':
            return deletePrestasi(req, res, id as string);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

// GET: Ambil data berdasarkan prestasi_pribadi_id
async function getPrestasiById(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const { data, error } = await supabase
            .schema('siap')
            .from('spg_riwayat_prestasi_pribadi')
            .select('*')
            .eq('prestasi_pribadi_id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: "Prestasi not found" });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

// PUT: Update data prestasi berdasarkan prestasi_pribadi_id
async function updatePrestasi(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const { nama_penghargaan, tahun, tingkat, instansi_pemberi, peg_id } = req.body;

        if (!nama_penghargaan || !tahun || !tingkat || !instansi_pemberi || !peg_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const { data, error } = await supabase
            .schema('siap')
            .from('spg_riwayat_prestasi_pribadi')
            .update({ nama_penghargaan, tahun, tingkat, instansi_pemberi, peg_id })
            .eq('prestasi_pribadi_id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: "Prestasi not found" });

        res.status(200).json({ message: "Prestasi updated successfully", data });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

// DELETE: Hapus data berdasarkan prestasi_pribadi_id
async function deletePrestasi(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const { error } = await supabase
            .schema('siap')
            .from('spg_riwayat_prestasi_pribadi')
            .delete()
            .eq('prestasi_pribadi_id', id);

        if (error) throw error;

        res.status(200).json({ message: "Prestasi deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
=======
import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    const { id } = req.query; // Get the id from the query parameters

    try {
        // Handle PUT request
        if (req.method === 'PUT') {
            if (!id) {
                return res.status(400).json({ error: "'id' parameter is required" });
            }

            const {
                peg_id,
                nama_penghargaan,
                tahun,
                tingkat,
                instansi_pemberi
            } = req.body;

            if (!peg_id || !nama_penghargaan) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const { data, error } = await supabase
                .schema('siap')
                .from('spg_riwayat_prestasi_pribadi')
                .update({
                    nama_penghargaan,
                    tahun,
                    tingkat,
                    instansi_pemberi
                })
                .eq('prestasi_pribadi_id', id) // Use the correct column name
                .select();

            if (error) {
                console.error("Error updating data:", error);
                return res.status(500).json({ error: error.message });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No data found for the given riw_id" });
            }

            return res.status(200).json({
                message: "Data successfully updated",
                data
            });
        }

        // Handle DELETE request
        if (req.method === 'DELETE') {
            if (!id) {
                return res.status(400).json({ error: "'id' parameter is required" });
            }

            const { error } = await supabase
                .schema('siap')
                .from('spg_riwayat_prestasi_pribadi')
                .delete()
                .eq('prestasi_pribadi_id', id); // Use the correct column name

            if (error) {
                console.error("Error deleting data:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({
                message: "Data successfully deleted"
            });
        }
        // Handle unsupported methods
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (error) {
        console.error("Error in handler:", error);
        return res.status(500).json({ error: error.message });
>>>>>>> 30f6765d1db69bcd62b78e99b65c87f49eb5c903
    }
}
