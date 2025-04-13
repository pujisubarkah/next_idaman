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
    }
}
