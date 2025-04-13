import { supabase } from '../../../../lib/supabaseClient'; // Pastikan path sudah benar
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ambil `peg_id` dari query parameter
    const { peg_id } = req.query;

    // Validasi jika `peg_id` tidak diberikan
    if (!peg_id) {
      return res.status(400).json({ message: 'peg_id is required' });
    }

    // Ambil data dokumen dari tabel dengan filter `peg_id`
    const { data, error } = await supabase
      .schema('siap') // Pastikan nama schema benar
      .from('spg_file_pegawai')
      .select(`
        peg_id,
        file_nama,
        file_lokasi,
        file_ket,
        file_tgl,
        m_spg_file_pegawai_ref (
          id,
          parent_id
        )
      `)
      .eq('peg_id', peg_id) // Filter berdasarkan peg_id
      .order('m_spg_file_pegawai_id', { ascending: true }); // Urutkan berdasarkan id pada tabel spg_file_pegawai

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(200).json([]);
    }

    // Ambil semua parent_id yang ada pada data untuk mendapatkan file_nama dari m_spg_file_pegawai_ref
    const parentIds = data
      .map((item: any) => item.m_spg_file_pegawai_ref?.parent_id)
      .filter((id: any) => id !== null && id !== 'null'); // Pastikan tidak ada "null" string yang terlibat

    // Ambil data file_nama dari tabel m_spg_file_pegawai_ref berdasarkan parent_id
    const { data: parentData, error: parentError } = await supabase
      .schema('siap') // Pastikan nama schema benar
      .from('m_spg_file_pegawai_ref')
      .select('id, file_nama')
      .in('id', parentIds); // Ambil file_nama yang sesuai dengan parent_id

    if (parentError) {
      throw parentError;
    }

    // Pemetaan parent_id ke file_nama
    const parentMapping = parentData?.reduce((acc: any, item: any) => {
      acc[item.id] = item.file_nama; // Menggunakan id sebagai kunci dan file_nama sebagai nilai
      return acc;
    }, {});

    // Kelompokkan dokumen berdasarkan kategori (parent_id dari m_spg_file_pegawai_ref)
    const groupedData = data.reduce((acc: any, item: any) => {
      const parentId = item.m_spg_file_pegawai_ref?.parent_id;
      const categoryName = parentMapping[parentId] || 'Lain - lain'; // Gunakan file_nama sebagai kategori

      const document = {
        peg_id: item.peg_id,
        namaFile: item.file_nama,
        fileUrl: item.file_lokasi,
        keterangan: item.file_ket, 
        tanggalUpload: item.file_tgl,
        
      };

      if (!acc[categoryName]) {
        acc[categoryName] = {
          category_name: categoryName,
          documents: [],
        };
      }

      acc[categoryName].documents.push(document);
      return acc;
    }, {});

    // Ubah objek menjadi array
    const result = Object.values(groupedData);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: error.message });
  }
}
