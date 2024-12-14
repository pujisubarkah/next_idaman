import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Menangani permintaan GET untuk mengambil data pegawai berdasarkan peg_id
    const { pegid } = req.query;

    if (!pegid) {
      return res.status(400).json({ error: "ID pegawai diperlukan" });
    }

    try {
      // Mengambil data pegawai berdasarkan peg_id
      const { data, error } = await supabase
        .schema("siap_skpd")
        .from("spg_pegawai")
        .select("*")
        .eq("peg_id", pegid)
        .single();

      if (error) {
        return res.status(500).json({ error: "Gagal mengambil data pegawai" });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("Kesalahan server:", err);
      return res.status(500).json({ error: "Kesalahan server" });
    }
  }

  if (req.method === "PUT") {
    // Menangani permintaan PUT untuk memperbarui data pegawai
    const { pegid, unit_kerj, nip, nama_lengkap } = req.body;

    if (!pegid) {
      return res.status(400).json({ error: "ID diperlukan untuk update data" });
    }

    const updatedData: { unit_kerj?: string; nip?: string; nama_lengkap?: string } = {};
    if (unit_kerj) updatedData.unit_kerj = unit_kerj;
    if (nip) updatedData.nip = nip;
    if (nama_lengkap) updatedData.nama_lengkap = nama_lengkap;

    try {
      // Melakukan update data
      const { data, error } = await supabase
        .schema("siap")
        .from("spg_pegawai")
        .update(updatedData)
        .eq("peg_id", pegid);

      if (error) {
        return res.status(500).json({ error: "Gagal memperbarui data" });
      }

      return res.status(200).json({ message: "Data berhasil diperbarui", data });
    } catch (err) {
      console.error("Kesalahan server:", err);
      return res.status(500).json({ error: "Kesalahan server" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
