import { supabase } from '../../../../../lib/supabaseClient'; // Ensure the correct path  
import { NextApiRequest, NextApiResponse } from 'next';  
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'GET') {  
    const { peg_id, page = 1, itemsPerPage = 10 } = req.query;  
  
    console.log('Request received at /api/pegawai'); // Debugging log  
  
    // Validate peg_id if provided  
    if (peg_id && isNaN(Number(peg_id))) {  
      return res.status(400).json({ error: 'ID pegawai tidak valid' });  
    }  
  
    // Parse page and itemsPerPage to numbers  
    const pageNumber = parseInt(Array.isArray(page) ? page[0] : page.toString()) || 1;  
    const itemsPerPageNumber = parseInt(Array.isArray(itemsPerPage) ? itemsPerPage[0] : itemsPerPage.toString()) || 10;  
  
    try {  
      // Build Supabase query for spg_pegawai  
      let query = supabase  
        .schema('siap_skpd')  
        .from('spg_pegawai')  
        .select('*', { count: 'exact' });  
  
      // Apply filter if `peg_id` is provided  
      if (peg_id) {  
        query = query.eq('peg_id', peg_id);  
      }  
  
      // Apply pagination  
      const { data, error, count } = await query.range(  
        (pageNumber - 1) * itemsPerPageNumber,  
        pageNumber * itemsPerPageNumber - 1  
      );  
  
      // Handle Supabase errors  
      if (error) {  
        console.error('Error fetching data:', error);  
        return res.status(500).json({ error: error.message || 'Error fetching data' });  
      }  
  
      // Handle empty data  
      if (!data || data.length === 0) {  
        console.log('No data found');  
        return res.status(404).json({ message: 'Data not found' });  
      }  
  
      // Fetch related data  
      const fetchData = async (table, columns) => {  
        const { data, error } = await supabase.schema('siap').from(table).select(columns);  
        if (error) throw error;  
        return data;  
      };  
  
      const [  
        statusData,  
        agamaData,  
        jenispegawai,  
        jenisasn,  
        jenispns,  
        pendidikanAwal,  
        kedudukanpegawai,  
        jabatan,  
        satuankerja,  
        unitkerja,  
        golongan,  
        goldar,  
        provinsi,  
        kabkot,  
        kecamatan,  
        kelurahan,  
      ] = await Promise.all([  
        fetchData('m_status_kawin', 'id, status'),  
        fetchData('m_spg_agama', 'id_agama, nm_agama'),  
        fetchData('jenis_pegawai', 'status_kepegawaian_id, stspeg_nama'),  
        fetchData('jenis_asn', 'id, nama'),  
        fetchData('jenis_pns', 'id_jen_pns, nama_jenis'),  
        fetchData('m_spg_pendidikan', 'id_pend, nm_pend, kat_pend_id'),  
       
        fetchData('m_spg_status_kepegawaian', 'id_status_kepegawaian, status'),  
        fetchData('m_spg_jabatan', 'jabatan_id, jabatan_nama, jabatan_jenis'),  
        fetchData('m_spg_satuan_kerja', 'satuan_kerja_id, satuan_kerja_nama'),  
        fetchData('m_spg_unit_kerja', 'unit_kerja_parent, unit_kerja_id, unit_kerja_nama'),  
        fetchData('m_spg_golongan', 'gol_id, nm_gol'),  
        fetchData('m_spg_golongan_darah', 'id_goldar, nm_goldar'),  
        fetchData('m_spg_propinsi', 'propinsi_id, propinsi_nm'),  
        fetchData('m_spg_kabupaten', 'kabupaten_id, kabupaten_nm'),  
        fetchData('m_spg_kecamatan', 'kecamatan_id, kecamatan_nm'),  
        fetchData('m_keldes', 'id, nama'),  
      ]);  
  
      console.log('Data fetched successfully'); // Debugging log  
  
      // Create mappings for easy lookup  
      const createMap = (data, key, value) => {  
        const map = {};  
        data.forEach(item => {  
          map[item[key]] = item[value];  
        });  
        return map;  
      };  
  
      const statusMap = createMap(statusData, 'id', 'status');  
      const agamaMap = createMap(agamaData, 'id_agama', 'nm_agama');  
      const jenispegawaiMap = createMap(jenispegawai, 'status_kepegawaian_id', 'stspeg_nama');  
      const jenisasnMap = createMap(jenisasn, 'id', 'nama');  
      const jenispnsMap = createMap(jenispns, 'id_jen_pns', 'nama_jenis');  
      const goldarMap = createMap(goldar, 'id_goldar', 'nm_goldar');  
      const jabatanMap = createMap(jabatan, 'jabatan_id', 'jabatan_nama');  
      const jabatanJenisMap = createMap(jabatan, 'jabatan_id', 'jabatan_jenis');  
      const satuankerjaMap = createMap(satuankerja, 'satuan_kerja_id', 'satuan_kerja_nama');  
      const unitkerjaMap = createMap(unitkerja, 'unit_kerja_id', 'unit_kerja_nama');  
      const golonganMap = createMap(golongan, 'gol_id', 'nm_gol');  
      const kedudukanMap = createMap(kedudukanpegawai, 'id_status_kepegawaian', 'status');  
      const provinsiMap = createMap(provinsi, 'propinsi_id', 'propinsi_nm');  
      const kabkotMap = createMap(kabkot, 'kabupaten_id', 'kabupaten_nm');  
      const kecamatanMap = createMap(kecamatan, 'kecamatan_id', 'kecamatan_nm');  
      const kelurahanMap = createMap(kelurahan, 'id', 'nama');  
      const pendidikanAwalMap = createMap(pendidikanAwal, 'id_pend', 'nm_pend',); 
      const pendidikanAkhirMap = createMap(pendidikanAwal, 'id_pend', 'nm_pend'); 
  
      // Mapping for jabatan_jenis  
      const jabatanJenisNameMap = {  
        2: 'Struktural',  
        3: 'Fungsional Tertentu',  
        4: 'Fungsional Umum',  
      };  
  
      // Combine the data with related information  
      const combinedData = data.map(pegawai => ({  
        ...pegawai,  
        status_perkawinan: statusMap[pegawai.peg_status_perkawinan] || null,  
        nama_agama: agamaMap[pegawai.id_agama] || null,  
        status_kepegawaian: jenispegawaiMap[pegawai.peg_status_kepegawaian] || null,  
        nama_jenis_asn: jenisasnMap[pegawai.peg_jenis_asn] || null,  
        jenis_pns: jenispnsMap[pegawai.peg_jenis_pns] || null,  
        golongan_darah: goldarMap[pegawai.id_goldar] || null,  
        jabatan_nama: jabatanMap[pegawai.jabatan_id] || null,  
        nama_jabatan_jenis: jabatanJenisNameMap[jabatanJenisMap[pegawai.jabatan_id]] || null,  
        satuan_kerja_nama: satuankerjaMap[pegawai.satuan_kerja_id] || null,  
        unit_kerja_nama: unitkerjaMap[pegawai.unit_kerja_id] || null,  
        gol_awal: golonganMap[pegawai.gol_id_awal] || null,  
        gol_akhir: golonganMap[pegawai.gol_id_akhir] || null,  
        kedudukanpegawai: kedudukanMap[pegawai.id_status_kepegawaian] || null,  
        nama_provinsi: provinsiMap[pegawai.id_provinsi] || null,  
        provinsi_ktp: provinsiMap[pegawai.id_provinsi_ktp] || null,  
        nama_kabkot: kabkotMap[pegawai.id_kota] || null,  
        kabkot_ktp: kabkotMap[pegawai.id_kota_ktp] || null,  
        pend_awal: pendidikanAwalMap[pegawai.id_pend_awal] || null,
        pend_akhir: pendidikanAkhirMap[pegawai.id_pend_akhir] || null,
       
      }));  
  
      // Return data with total count  
      return res.status(200).json({  
        data: combinedData,  
        totalItems: count || 0,  
      });  
    } catch (error) {  
      console.error('Unexpected error:', error);  
      return res.status(500).json({ error: 'Internal Server Error' });  
    }  
  } else {  
    // Handle methods other than GET  
    res.setHeader('Allow', ['GET']);  
    return res.status(405).json({ error: 'Method Not Allowed' });  
  }  
}  
