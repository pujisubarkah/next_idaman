import { supabase } from '../../../../../lib/supabaseClient'; // Ensure the correct path

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { peg_id, page = 1, itemsPerPage = 10 } = req.query;

    console.log('Request received at /api/pegawai'); // Debugging log

    // Validate peg_id if provided
    if (peg_id && isNaN(peg_id)) {
      return res.status(400).json({ error: 'ID pegawai tidak valid' });
    }

    // Parse page and itemsPerPage to numbers
    const pageNumber = parseInt(page) || 1;
    const itemsPerPageNumber = parseInt(itemsPerPage) || 10;

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

      // Fetch status from m_status_kawin
      const { data: statusData, error: statusError } = await supabase
        .schema('siap')
        .from('m_status_kawin')
        .select('id, status');

      if (statusError) {
        throw statusError;
      }

      // Fetch agama from m_spg_agama
      const { data: agamaData, error: agamaError } = await supabase
        .schema('siap')
        .from('m_spg_agama')
        .select('id_agama, nm_agama');

      if (agamaError) {
        throw agamaError;
      }

      // Fetch status pegawai
      const { data: jenispegawai, error: jenispegawaiError } = await supabase
        .schema('siap')
        .from('jenis_pegawai')
        .select('status_kepegawaian_id, stspeg_nama');

      if (jenispegawaiError) {
        throw jenispegawaiError;
      }

      // Fetch jenisASN
      const { data: jenisasn, error: jenisasnError } = await supabase
      .schema('siap')
      .from('jenis_asn')
      .select('id, nama');

      if (jenisasnError) {
      throw jenisasnError;
      }

      //Fetch jenisPNS
      const { data: jenispns, error: jenispnsError } = await supabase
      .schema('siap')
      .from('jenis_pns')
      .select('id_jen_pns, nama_jenis');

      if (jenispnsError) {
      throw jenispnsError;
      }

    // Fetch Pendidikan Awal
      const { data: pendidikanAwal, error: pendidikanAwalError } = await supabase
      .schema('siap')
      .from('m_spg_pendidikan')
      .select('id_pend, nm_pend');

      if (pendidikanAwalError) {
      throw pendidikanAwalError;
      }

      // Fetch kedudukan pegawai
      const { data: kedudukanpegawai, error: kedudukanpegawaiError } = await supabase
      .schema('siap')
      .from('m_spg_status_kepegawaian')
      .select('id_status_kepegawaian, status');

      if (kedudukanpegawaiError) {
      throw kedudukanpegawaiError;
      }

      // Fetch Nama jabatan
      const { data: jabatan, error: jabatanError } = await supabase
      .schema('siap')
      .from('m_spg_jabatan')
      .select('jabatan_id, jabatan_nama');

      if (jabatanError) {
      throw jabatanError;
      }

    // Fetch Satuan Kerja
      const { data: satuankerja, error: satuankerjaError } = await supabase
      .schema('siap')
      .from('m_spg_satuan_kerja')
      .select('satuan_kerja_id, satuan_kerja_nama');

      if (satuankerjaError) {
      throw satuankerjaError;
      }

      // Fetch unit Kerja
      const { data: unitkerja, error: unitkerjaError } = await supabase
      .schema('siap')
      .from('m_spg_unit_kerja')
      .select('unit_kerja_parent, unit_kerja_id, unit_kerja_nama');

      if (unitkerjaError) {
      throw unitkerjaError;
      }

      // Fetch Golongan Awal
      const { data: golongan, error: golonganError } = await supabase
      .schema('siap')
      .from('m_spg_golongan')
      .select('gol_id, nm_gol');

      if (golonganError) {
      throw golonganError;
      }


    // Fetch Golongan Darah
      const { data: goldar, error: goldarError } = await supabase
      .schema('siap')
      .from('m_spg_golongan_darah')
      .select('id_goldar, nm_goldar');

      if (goldarError) {
      throw goldarError;
      }

     //Fetch Provinsi, Kabupaten, Kecamatan, Kelurahan
      const { data: provinsi, error: provinsiError } = await supabase
      .schema('siap')
      .from('m_spg_propinsi')
      .select('propinsi_id, propinsi_nm');

      if (provinsiError) {
      throw provinsiError;
      }

       //Fetch Kabupaten, kota
      const { data: kabkot, error: kabkotError } = await supabase
      .schema('siap')
      .from('m_spg_kabupaten')
      .select('kabupaten_id, kabupaten_nm');

      if (kabkotError) {
      throw kabkotError;
      }

      //Fetch Kecamatan
      const { data: kecamatan, error: kecamatanError } = await supabase
      .schema('siap')
      .from('m_spg_kecamatan')
      .select('kecamatan_id, kecamatan_nm');

      if (kecamatanError) {
      throw kecamatanError;
      }

      

      //Fetch Kelurahan
      const { data: kelurahan, error: kelurahanError } = await supabase
      .schema('siap')
      .from('m_keldes')
      .select('id, nama');

      if (kelurahanError) {
      throw kelurahanError;
      }

     
      //fetch pendidkan awal
      const { data: pendidikanawal, error: pendidikanawalError } = await supabase
      .schema('siap')
      .from('m_spg_pendidikan')
      .select('id_pend, nm_pend');

      if (pendidikanawalError) {
        throw pendidikanawalError;
        }

  console.log('Data fetched successfully'); // Debugging log


      // Create a mapping of status by id for easy lookup
      const statusMap = {};
      statusData.forEach(status => {
        statusMap[status.id] = status.status;
      });

      // Create a mapping of agama by id for easy lookup
      const agamaMap = {};
      agamaData.forEach(agama => {
        agamaMap[agama.id_agama] = agama.nm_agama;
      });

      // Create a mapping of jenispegawai by id for easy lookup
      const jenispegawaiMap = {};
      jenispegawai.forEach(jenispegawai => {
        jenispegawaiMap[jenispegawai.status_kepegawaian_id] = jenispegawai.stspeg_nama;
      });

      // Create a mapping of jenispegawai by id for easy lookup
      const jenisasnMap = {};
      jenisasn?.forEach(jenisasn => {
      jenisasnMap[jenisasn.id] = jenisasn.nama;
      });

    // Create a mapping of jenispns by id for easy lookup
    const jenispnsMap = {};
    jenispns?.forEach(jenispns => {
    jenispnsMap[jenispns.id_jen_pns] = jenispns.nama_jenis;
    });

    // Create a mapping of goldar 
    const goldarMap = {};
    goldar?.forEach(goldar => {
    goldarMap[goldar.id_goldar] = goldar.nm_goldar;
    });


    // Create a mapping of jabatan
    const jabatanMap = {};
    jabatan?.forEach(jabatan => {
    jabatanMap[jabatan.jabatan_id] = jabatan.jabatan_nama;
    });

     // Create a mapping of satuan kerja
     const satuankerjaMap = {};
     satuankerja?.forEach(satuankerja => {
     satuankerjaMap[satuankerja.satuan_kerja_id] = satuankerja.satuan_kerja_nama;
     });

     // Create a mapping of unit kerja
    const unitkerjaMap = {};
    const parentMap = {};

    // First, create a mapping for unit kerja and their parents
    unitkerja?.forEach(unit => {
    unitkerjaMap[unit.unit_kerja_id] = unit.unit_kerja_nama;
    if (unit.unit_kerja_parent) {
    parentMap[unit.unit_kerja_id] = unit.unit_kerja_parent;
    }
    });

    

    // Now, create a mapping for parent names
    const unitkerjaParentMap = {};
    unitkerja?.forEach(unit => {
    if (unit.unit_kerja_parent) {
    unitkerjaParentMap[unit.unit_kerja_parent] = unitkerjaMap[unit.unit_kerja_parent];
    }
    });

    // Combine parent and child names
    const combinedUnitKerjaNames = {};
    unitkerja?.forEach(unit => {
    if (unit.unit_kerja_parent) {
    const parentName = unitkerjaParentMap[unit.unit_kerja_parent] || '';
    const childName = unitkerjaMap[unit.unit_kerja_id] || '';
    combinedUnitKerjaNames[unit.unit_kerja_id] = `${parentName} - ${childName}`.trim();
    } else {
    combinedUnitKerjaNames[unit.unit_kerja_id] = unitkerjaMap[unit.unit_kerja_id];
    }
    });

    // Create a mapping of jabatan
    const golonganMap = {};
    golongan?.forEach(golonganawal => {
    golonganMap[golonganawal.gol_id] = golonganawal.nm_gol;
    });

    // Create a mapping of kedudukan pegawai
    const kedudukanMap = {};
    kedudukanpegawai?.forEach(kedudukan => {
    kedudukanMap[kedudukan.id_status_kepegawaian] = kedudukan.status;
    });

    // Create a mapping of provinsi
    const provinsiMap = {};
    provinsi?.forEach(provinsi => {
    provinsiMap[provinsi.propinsi_id] = provinsi.propinsi_nm;
    });

    // Create a mapping of kabupaten
    const kabkotMap = {};
    kabkot?.forEach(kabkot => {
    kabkotMap[kabkot.kabupaten_id] = kabkot.kabupaten_nm;
    });

    // Create a mapping of kecamatan
    const kecamatanMap = {};
    kecamatan?.forEach(kecamatan => {
    kecamatanMap[kecamatan.kecamatan_id] = kecamatan.kecamatan_nm;
    });    


    // Create a mapping of kelurahan
    const kelurahanMap = {};
    kelurahan?.forEach(kelurahan => {
    kelurahanMap[kelurahan.id] = kelurahan.nama;
    });

    // Create a mapping of pendidikan awal
    const pendidikanAwalMap = {};
    pendidikanAwal?.forEach(pendidikanawal => {
    pendidikanAwalMap[pendidikanawal.id_pend] = pendidikanawal.nm_pend;
    });

    


      // Combine the data with status, agama, and jenispegawai
      const combinedData = data.map(pegawai => {
        return {
          ...pegawai,
          status_perkawinan: statusMap[pegawai.peg_status_perkawinan] || null, // Add status based on peg_status_perkawinan
          nama_agama: agamaMap[pegawai.id_agama] || null, // Add agama based on id_agama
          status_kepegawaian: jenispegawaiMap[pegawai.peg_status_kepegawaian] || null, // Add jenispegawai based on peg_jenispegawai
          nama_jenis_asn: jenisasnMap[pegawai.peg_jenis_asn] || null, // Add jenisasn based on jenis_asn
          jenis_pns: jenispnsMap[pegawai.peg_jenis_pns] || null, // Add jenispns based on jenis_pns
          golongan_darah: goldarMap[pegawai.id_goldar] || null, // Add goldar based on peg_goldar
          jabatan_nama: jabatanMap[pegawai.jabatan_id] || null, // Add jabatan based on jabatan_id
          satuan_kerja_nama: satuankerjaMap[pegawai.satuan_kerja_id] || null, // Add satker based on satuan_kerja_id
          unit_kerja_nama: combinedUnitKerjaNames[pegawai.unit_kerja_id] || null,
          gol_awal: golonganMap[pegawai.gol_id_awal] || null, // Add golongan based on gol_id
          gol_akhir: golonganMap[pegawai.gol_id_akhir] || null, // Add golongan based on gol_id
          kedudukanpegawai: kedudukanMap[pegawai.id_status_kepegawaian] || null, // Add kedudukan based on id_status_kepegawaian
          nama_provinsi: provinsiMap[pegawai.id_provinsi] || null, // Add provinsi based on propinsi_id
          provinsi_ktp: provinsiMap[pegawai.id_provinsi_ktp] || null, // Add provinsi based on propinsi_id
          nama_kabkot: kabkotMap[pegawai.id_kota] || null, // Add kabkot based on kabupaten_id
          kabkot_ktp: kabkotMap[pegawai.id_kota_ktp] || null, // Add kabkot based on kabupaten_id
          nama_kecamatan: kecamatanMap[pegawai.id_kec] || null, // Add kecamatan based on kecamatan_id
          kecamatan_ktp: kecamatanMap[pegawai.id_kec_ktp] || null, // Add kecamatan based on kecamatan_id
          nama_kelurahan: kelurahanMap[pegawai.id_kel] || null, // Add kelurahan based on id
          kelurahan_ktp: kelurahanMap[pegawai.id_kel_ktp] || null, // Add kelurahan based on id
          pend_awal: pendidikanAwalMap[pegawai.id_pend_awal] || null, // Add pendidikan awal based on id_pend



          
        };
      });



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
