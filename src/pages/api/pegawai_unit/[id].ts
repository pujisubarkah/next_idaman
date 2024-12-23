import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Parameter ID tidak ditemukan' });
  }

  if (method === 'GET') {
    try {
      const { data, error } = await supabase
      .schema('siap_skpd')
        .from('spg_pegawai')
        .select(`satuan_kerja_id, 
                  unit_kerja_id,
                   peg_nip,
                   peg_nip_lama,
                   peg_nama,
                   peg_gelar_depan,
                   peg_gelar_belakang,
                   peg_lahir_tempat,
                   peg_lahir_tanggal,
                   peg_foto,
                   peg_jenis_kelamin,
                   peg_status_perkawinan,
                   id_agama,
                   peg_jenis_asn,
                   peg_jenis_pns,
                  status_tkd,
                  peg_status_kepegawaian,
                  peg_cpns_tmt,
                  peg_pns_tmt,
                  id_pend_awal,
                  peg_pend_awal_th,
                  id_pend_akhir,
                  peg_pend_akhir_th,
                  jabatan_id,
                  peg_status_gaji,
                  kedudukan_pegawai,
                  gol_id_awal,
                  peg_gol_awal_tmt,
                  gol_id_akhir,
                  peg_gol_akhir_tmt,
                  peg_karpeg,
                  peg_no_askes,
                  peg_karsutri,
                  peg_bapertarum`) // Kolom yang diambil
        .eq('peg_id', id);

      if (error) throw error;

      if (data.length === 0) {
        return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
      }

      return res.status(200).json(data[0]);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else if (method === 'POST') {
    try {
      const { peg_nama, peg_nip, peg_gelar_depan, satuan_kerja_id, unit_kerja_id, peg_nip_lama, peg_gelar_belakang, peg_lahir_tempat, peg_lahir_tanggal, peg_foto, peg_jenis_kelamin, peg_status_perkawinan, id_agama, peg_jenis_asn, peg_jenis_pns, status_tkd, peg_status_kepegawaian, peg_cpns_tmt, peg_pns_tmt, id_pend_awal, peg_pend_awal_th, id_pend_akhir, peg_pend_akhir_th, jabatan_id, peg_status_gaji, kedudukan_pegawai, gol_id_awal, peg_gol_awal_tmt, gol_id_akhir, peg_gol_akhir_tmt, peg_karpeg, peg_no_askes, peg_karsutri, peg_bapertarum } = req.body;

      if (!peg_nama || !peg_nip) {
        return res.status(400).json({ message: 'Nama dan NIP wajib diisi' });
      }

      const { data, error } = await supabase
      .schema('siap_skpd')
        .from('spg_pegawai')
        .insert([{
          satuan_kerja_id,
          unit_kerja_id,
          peg_nip,
          peg_nip_lama,
          peg_nama,
          peg_gelar_depan,
          peg_gelar_belakang,
          peg_lahir_tempat,
          peg_lahir_tanggal,
          peg_foto,
          peg_jenis_kelamin,
          peg_status_perkawinan,
          id_agama,
          peg_jenis_asn,
          peg_jenis_pns,
          status_tkd,
          peg_status_kepegawaian,
          peg_cpns_tmt,
          peg_pns_tmt,
          id_pend_awal,
          peg_pend_awal_th,
          id_pend_akhir,
          peg_pend_akhir_th,
          jabatan_id,
          peg_status_gaji,
          kedudukan_pegawai,
          gol_id_awal,
          peg_gol_awal_tmt,
          gol_id_akhir,
          peg_gol_akhir_tmt,
          peg_karpeg,
          peg_no_askes,
          peg_karsutri,
          peg_bapertarum
        }]);

      if (error) throw error;

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
  } else if (method === 'PUT') {
    try {
      const { peg_nama, peg_nip, peg_gelar_depan, satuan_kerja_id, unit_kerja_id, peg_nip_lama, peg_gelar_belakang, peg_lahir_tempat, peg_lahir_tanggal, peg_foto, peg_jenis_kelamin, peg_status_perkawinan, id_agama, peg_jenis_asn, peg_jenis_pns, status_tkd, peg_status_kepegawaian, peg_cpns_tmt, peg_pns_tmt, id_pend_awal, peg_pend_awal_th, id_pend_akhir, peg_pend_akhir_th, jabatan_id, peg_status_gaji, kedudukan_pegawai, gol_id_awal, peg_gol_awal_tmt, gol_id_akhir, peg_gol_akhir_tmt, peg_karpeg, peg_no_askes, peg_karsutri, peg_bapertarum } = req.body;

      if (!peg_nama && !peg_nip && !peg_gelar_depan) {
        return res.status(400).json({ message: 'Tidak ada kolom untuk diperbarui' });
      }

      const { data, error } = await supabase
      .schema('siap_skpd')
        .from('spg_pegawai')
        .update({ satuan_kerja_id,
          unit_kerja_id,
          peg_nip,
          peg_nip_lama,
          peg_nama,
          peg_gelar_depan,
          peg_gelar_belakang,
          peg_lahir_tempat,
          peg_lahir_tanggal,
          peg_foto,
          peg_jenis_kelamin,
          peg_status_perkawinan,
          id_agama,
          peg_jenis_asn,
          peg_jenis_pns,
          status_tkd,
          peg_status_kepegawaian,
          peg_cpns_tmt,
          peg_pns_tmt,
          id_pend_awal,
          peg_pend_awal_th,
          id_pend_akhir,
          peg_pend_akhir_th,
          jabatan_id,
          peg_status_gaji,
          kedudukan_pegawai,
          gol_id_awal,
          peg_gol_awal_tmt,
          gol_id_akhir,
          peg_gol_akhir_tmt,
          peg_karpeg,
          peg_no_askes,
          peg_karsutri,
          peg_bapertarum })
        .eq('peg_id', id);

      if (error) throw error;

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating data', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
