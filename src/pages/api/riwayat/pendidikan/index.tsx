import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return handlePost(req, res);
    } else if (req.method === 'GET') {
        return handleGet(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

async function handlePost(req, res) {
    try {
        const {
            peg_id, tingpend_id, jurusan_id, univ_id,
            tahun_lulus, ipk, no_ijazah
        } = req.body;

        if (!peg_id || !tingpend_id || !jurusan_id || !univ_id || !tahun_lulus) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newRecord = await prisma.siap_skpd_spg_riwayat_pendidikan.upsert({
            where: {
                peg_id_tingpend_id: {
                    peg_id,
                    tingpend_id
                }
            },
            update: {
                jurusan_id,
                univ_id,
                tahun_lulus,
                ipk,
                no_ijazah
            },
            create: {
                peg_id,
                tingpend_id,
                jurusan_id,
                univ_id,
                tahun_lulus,
                ipk,
                no_ijazah
            }
        });

        return res.status(201).json({
            message: "Data inserted/updated successfully",
            data: newRecord
        });
    } catch (error) {
        console.error("Error in POST handler:", error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleGet(req, res) {
    try {
        const { peg_id } = req.query;

        if (!peg_id) {
            return res.status(400).json({ error: "'peg_id' parameter is required" });
        }

        const pendidikan = await prisma.siap_skpd_spg_riwayat_pendidikan.findMany({
            where: { peg_id },
            orderBy: { tingpend_id: 'asc' },
            include: {
                tingkat_pendidikan: true,
                jurusan: true,
                universitas: true
            }
        });

        if (!pendidikan || pendidikan.length === 0) {
            return res.status(404).json({ error: "No data found for the given peg_id" });
        }

        const formatted = pendidikan.map(p => ({
            ...p,
            nm_tingpend: p.tingkat_pendidikan?.nm_tingpend || null,
            nama_jurusan: p.jurusan?.jurusan_nm || null,
            nama_univ: p.universitas?.univ_nmpti || null
        }));

        return res.status(200).json(formatted);
    } catch (error) {
        console.error("Error in GET handler:", error);
        return res.status(500).json({ error: error.message });
    }
}
