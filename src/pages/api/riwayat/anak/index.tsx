// pages/api/spg/riwayat/[peg_id].ts atau [peg_id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { peg_id } = req.query;

  try {
    if (req.method === 'GET') {
      if (!peg_id) {
        return res.status(400).json({ error: "'peg_id' parameter is required" });
      }

      const data = await prisma.siap_skpd_spg_riwayat.findMany({
        where: {
          peg_id: peg_id,
          riw_status: '1'
        }
      });

      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No data found for the given peg_id" });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const {
        peg_id,
        nik,
        nip,
        riw_nama,
        riw_ket,
        riw_kelamin,
        riw_tempat_lahir,
        riw_tgl_lahir,
        is_asn,
        is_asn_satu_instansi,
        riw_status_tunj,
        riw_status_perkawinan,
        riw_pendidikan,
        riw_pekerjaan,
        riw_status,
      } = req.body;

      if (!peg_id || !riw_nama) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newData = await prisma.siap_skpd_spg_riwayat.create({
        data: {
          peg_id,
          nik,
          nip,
          riw_nama,
          riw_ket,
          riw_kelamin,
          riw_tempat_lahir,
          riw_tgl_lahir: riw_tgl_lahir ? new Date(riw_tgl_lahir) : null,
          is_asn,
          is_asn_satu_instansi,
          riw_status_tunj,
          riw_status_perkawinan,
          riw_pendidikan,
          riw_pekerjaan,
          riw_status,
        },
      });

      return res.status(201).json({
        message: "Data successfully added",
        data: newData,
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: error.message });
  }
}
