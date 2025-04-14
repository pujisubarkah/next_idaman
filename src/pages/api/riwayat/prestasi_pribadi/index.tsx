import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getPrestasi(req, res);
  } else if (req.method === 'POST') {
    return addPrestasi(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// GET: Ambil data berdasarkan peg_id
async function getPrestasi(req, res) {
  try {
    const { peg_id } = req.query;

    if (!peg_id) {
      return res.status(400).json({ error: "'peg_id' parameter is required" });
    }

    const data = await prisma.spg_riwayat_prestasi_pribadi.findMany({
      where: {
        peg_id: BigInt(peg_id), // pakai BigInt kalau peg_id panjang
      },
      select: {
        prestasi_pribadi_id: true,
        nama_penghargaan: true,
        tahun: true,
        tingkat: true,
        instansi_pemberi: true,
        peg_id: true,
      },
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found for the given peg_id" });
    }

    const cleanData = JSON.parse(JSON.stringify(data, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST: Tambah data baru
async function addPrestasi(req, res) {
  try {
    const { nama_penghargaan, tahun, tingkat, instansi_pemberi, peg_id } = req.body;

    if (!nama_penghargaan || !tahun || !tingkat || !instansi_pemberi || !peg_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newData = await prisma.spg_riwayat_prestasi_pribadi.create({
      data: {
        nama_penghargaan,
        tahun,
        tingkat,
        instansi_pemberi,
        peg_id: BigInt(peg_id),
      },
    });

    const cleanData = JSON.parse(JSON.stringify(newData, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v
    ));

    res.status(201).json({ message: "Prestasi berhasil ditambahkan", data: cleanData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
