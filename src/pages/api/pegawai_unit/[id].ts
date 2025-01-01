import { supabase } from '../../../../lib/supabaseClient';

const handleErrorResponse = (res, message, error) => {
  return res.status(500).json({ message, error: error.message });
};

const handleSuccessResponse = (res, data, status = 200) => {
  return res.status(status).json(data);
};

const validateRequiredFields = (fields) => {
  return fields.every(field => field !== undefined && field !== null && field !== '');
};

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Parameter ID tidak ditemukan' });
  }

  const commonFields = [
    'satuan_kerja_id', 'unit_kerja_id', 'peg_nip', 'peg_nip_lama', 'id_goldar',
    'peg_nama', 'peg_gelar_depan', 'peg_gelar_belakang', 'peg_lahir_tempat',
    'peg_lahir_tanggal', 'peg_foto', 'peg_jenis_kelamin', 'peg_status_perkawinan',
    'id_agama', 'peg_jenis_asn', 'peg_jenis_pns', 'status_tkd', 'peg_status_kepegawaian',
    'peg_cpns_tmt', 'peg_pns_tmt', 'id_pend_awal', 'peg_pend_awal_th', 'id_pend_akhir',
    'peg_pend_akhir_th', 'jabatan_id', 'peg_status_gaji', 'kedudukan_pegawai',
    'gol_id_awal', 'peg_gol_awal_tmt', 'gol_id_akhir', 'peg_gol_akhir_tmt',
    'peg_karpeg', 'peg_no_askes', 'peg_ktp', 'peg_npwp', 'peg_karsutri',
    'peg_jabatan_tmt', 'peg_skpd_tmt', 'peg_eselon_tmt', 'id_status_kepegawaian',
    'peg_bapertarum', 'peg_no_rekening', 'peg_gol_awal_tmt', 'peg_rumah_alamat', 'id_provinsi',
    'id_kota', 'id_kec', 'id_kel', 'peg_email', 'peg_email_resmi', 'peg_alamat_rt','peg_alamat_rw','peg_kodepos',
    'peg_telp', 'peg_telp_hp','peg_rumah_alamat_ktp','id_provinsi_ktp','id_kota_ktp','id_kec_ktp',
    'id_kel_ktp','peg_alamat_rt_ktp','peg_alamat_rw_ktp','peg_kodepos_ktp', 'peg_tmt_kgb'
  ];

  if (method === 'GET') {
    try {
      const { data, error } = await supabase
        .schema('siap_skpd')
        .from('spg_pegawai')
        .select(commonFields.join(', '))
        .eq('peg_id', id);

      if (error) throw error;

      if (data.length === 0) {
        return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
      }

      return handleSuccessResponse(res, data[0]);
    } catch (error) {
      return handleErrorResponse(res, 'Error fetching data', error);
    }
  } else if (method === 'POST') {
    try {
      const newData = req.body;

      if (!validateRequiredFields([newData.peg_nama, newData.peg_nip])) {
        return res.status(400).json({ message: 'Nama dan NIP wajib diisi' });
      }

      const { data, error } = await supabase
        .schema('siap_skpd')
        .from('spg_pegawai')
        .insert([newData]);

      if (error) throw error;

      return handleSuccessResponse(res, data, 201);
    } catch (error) {
      return handleErrorResponse(res, 'Error inserting data', error);
    }
  } else if (method === 'PUT') {
    try {
      const updatedData = req.body;

      if (!validateRequiredFields([updatedData.peg_nama, updatedData.peg_nip, updatedData.peg_gelar_depan])) {
        return res.status(400).json({ message: 'Tidak ada kolom untuk diperbarui' });
      }

      const { data, error } = await supabase
        .schema('siap_skpd')
        .from('spg_pegawai')
        .update(updatedData)
        .eq('peg_id', id);

      if (error) throw error;

      return handleSuccessResponse(res, data);
    } catch (error) {
      return handleErrorResponse(res, 'Error updating data', error);
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}