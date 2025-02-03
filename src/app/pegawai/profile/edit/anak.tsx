"use client";  
  
import { useState, useEffect } from "react";  
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";  
import axios from "axios";  

const RiwayatAnak = () => {  
  const formatTanggal = (tanggal: string) => {  
    const bulanIndo = [  
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",  
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"  
    ];  
  
    const date = new Date(tanggal);  
    const hari = date.getDate();  
    const bulan = bulanIndo[date.getMonth()];  
    const tahun = date.getFullYear();  
  
    return `${hari}-${bulan}-${tahun}`;  
  };   
  
  interface DataDummy {  
    no: number;
    riw_id: number;
    nik: string;  
    nip: string;
    namaAnak: string; 
    jenisKelamin: string;  
    tempatLahir: string;
    tanggalLahir: string;
    isASN: boolean;
    isASNSatuInstansi: boolean;
    statusPerkawinan: string;
    memperolehTunjangan: boolean;  
    pendidikan: string;  
    pekerjaan: string; 
    aktaAnak: string;
  }  
  
  const [data, setData] = useState<DataDummy[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  
  const [formData, setFormData] = useState({  
    no: 0,
    riw_id: 0,
    nik: '',  
    nip: '',
    namaAnak: '',  
    jenisKelamin: '', 
    isASN: false, 
    isASNSatuInstansi: false,  
    tempatLahir: '',  
    tanggalLahir: new Date().toISOString().split("T")[0],  
    statusPerkawinan: '',  
    memperolehTunjangan: false,  
    pendidikan: '',  
    pekerjaan: '',  
    aktaAnak: null as File | null,  
  }); 
  
  const fetchRiwayatAnak = async (nip: string) => {  
    try {  
      const response = await axios.get(`/api/riwayat/anak?peg_id=${nip}`);  
      const sortedData = response.data.sort((a: any, b: any) =>  
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()  
      );  
  
      const mappedData = sortedData.map((item: any, index: number) => ({  
        no: index + 1,  
        riw_id: item.riw_id,
        nik: item.nik, 
        nip: item.nip, 
        namaAnak: item.riw_nama,  
        jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",  
        tempatLahir: item.riw_tempat_lahir,
        tanggalLahir: formatTanggal(item.riw_tgl_lahir),
        isASN: item.is_asn,  
        isASNSatuInstansi: item.is_asn_satu_instansi,
        statusPerkawinan: item.riw_status_perkawinan === 1 ? "Menikah" : "Belum menikah",  
        memperolehTunjangan: item.riw_status_tunj,  
        pendidikan: item.riw_pendidikan,  
        pekerjaan: item.riw_pekerjaan,
      }));  
  
      setData(mappedData);  
    } catch (error) {  
      console.error("Error fetching data:", error);  
    }  
  };  
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  
  
    if (nipFromUrl) {  
      fetchRiwayatAnak(nipFromUrl);  
    }  
  }, []);  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {  
    const { name, value } = e.target;  
    setFormData((prevData) => ({  
      ...prevData,  
      [name]: value,  
    }));  
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const { name, files } = e.target;  
    if (files) {  
      setFormData((prev) => ({ ...prev, [name]: files[0] }));  
    }  
  };  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    try {  
      const payload = {  
        peg_id: nip,  
        nik: formData.nik,  
        nip: formData.nip,
        riw_nama: formData.namaAnak,  
        riw_ket: "ANAK",  
        riw_kelamin: formData.jenisKelamin === "L" ? "L" : "P",  
        riw_tempat_lahir: formData.tempatLahir, 
        riw_tgl_lahir: formData.tanggalLahir,
        is_asn: formData.nip !== null && formData.nip !== "" ? true : false,
        is_asn_satu_instansi: formData.isASNSatuInstansi,
        riw_status_tunj: formData.memperolehTunjangan,
        riw_status_perkawinan: formData.statusPerkawinan,
        riw_pendidikan: formData.pendidikan,  
        riw_pekerjaan: formData.pekerjaan,
        riw_status: 1,
      };  
  
      console.log("Request Body:", payload);  
  
      if (formData.riw_id) {  
        await axios.put(`/api/riwayat/anak/${formData.riw_id}`, payload);  
      } else {  
        await axios.post(`/api/riwayat/anak`, payload);  
      }  
      fetchRiwayatAnak(nip!);  
      closeModals();  
    } catch (error) {  
      console.error("Error saving data:", error.response?.data || error.message);  
    }  
  };  
  
  const openAddModal = () => {  
    setIsAddModalOpen(true);  
    setFormData({ no: 0, 
      riw_id: 0, 
      nik: "",  
      nip: "",
      namaAnak: "",
      jenisKelamin: "",  
      tempatLahir: "",
      tanggalLahir: new Date().toISOString().split("T")[0],
      isASN: false,
      isASNSatuInstansi: false,
      memperolehTunjangan: false,
      statusPerkawinan: "",
      pendidikan: "",  
      pekerjaan: "",
      aktaAnak: null}); // Reset form for adding  
  };  
  
  const closeModals = () => {  
    setIsAddModalOpen(false);  
    setIsEditModalOpen(false);  
  };  
  
  const handleEdit = (anak: DataDummy) => {  
    setFormData({  
      no: anak.no,
      riw_id: anak.riw_id,
      nik: anak.nik,
      nip: anak.nip,
      namaAnak: anak.namaAnak,
      jenisKelamin: anak.jenisKelamin  === "L" ? "L" : "P",
      tempatLahir: anak.tempatLahir, 
      tanggalLahir: new Date(anak.tanggalLahir).toISOString().split("T")[0],
      isASN: anak.isASN,
      isASNSatuInstansi: anak.isASNSatuInstansi,
      memperolehTunjangan: anak.memperolehTunjangan,
      statusPerkawinan: anak.statusPerkawinan,
      pendidikan: anak.pendidikan,
      pekerjaan: anak.pekerjaan,
      aktaAnak: null
    });  
    setIsEditModalOpen(true); // Open the edit modal  
  }; 
  
  const handleDelete = async (riw_id: number) => {  
    if (confirm("Apakah anda yakin akan menghapus data ini?")) {  
      try {  
        await axios.delete(`/api/riwayat/anak/${riw_id}`);  
        fetchRiwayatAnak(nip!);  
      } catch (error) {  
        console.error("Error deleting contact:", error);  
      }  
    }  
  };  
  
  return (  
    <div id="anak" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">RIWAYAT ANAK</h3>  
  
      <div className="flex justify-end mb-4">  
        <button  
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
          onClick={openAddModal}  
        >  
          <FaPlus className="inline-block mr-2" />  
          Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr>  
            <th className="p-3 border border-[#f2bd1d]">No</th>  
            <th className="p-3 border border-[#f2bd1d]">NIK/NIP</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama Anak</th>  
            <th className="p-3 border border-[#f2bd1d]">Jenis Kelamin</th>  
            <th className="p-3 border border-[#f2bd1d]">Tempat dan Tanggal Lahir</th>  
            <th className="p-3 border border-[#f2bd1d]">Status Perkawinan</th>  
            <th className="p-3 border border-[#f2bd1d]">Memperoleh Tunjangan</th>  
            <th className="p-3 border border-[#f2bd1d]">Pendidikan</th>  
            <th className="p-3 border border-[#f2bd1d]">Pekerjaan</th>
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={11} className="text-center p-4">  
                Data tidak ditemukan.  
              </td>  
            </tr>  
          ) : (  
            data.map((item, index) => (  
              <tr  
                key={index}  
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}  
              >  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nik}<br/>{item.nip}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.namaAnak}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jenisKelamin}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tempatLahir}, {item.tanggalLahir.toString()}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.statusPerkawinan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.memperolehTunjangan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.pendidikan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.pekerjaan}</td> 
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button  
                      className="text-green-500 hover:text-green-700"  
                      onClick={() => handleEdit(item)}  
                    >  
                      <FaEdit /> Edit  
                    </button>  
                    <button  
                      className="text-red-500 hover:text-red-700"  
                      onClick={() => handleDelete(item.riw_id)}  
                    >  
                      <FaTrash /> Delete  
                    </button>  
                  </div>  
                </td>  
              </tr>  
            ))  
          )}  
        </tbody>  
      </table>  
  
      {isAddModalOpen && (  
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">  
          <div className="bg-white p-8 rounded-lg w-1/3">  
            <h3 className="text-xl font-semibold mb-4">Tambah Data Anak</h3>  
            <form onSubmit={handleSubmit}>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="nik" className="block text-sm font-semibold w-1/3">NIK</label>  
                <input  
                  type="text"  
                  id="nik"  
                  name="nik"  
                  value={formData.nik}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />   
              </div>
              <div className="mb-4 flex items-center">  
                <label htmlFor="nip" className="block text-sm font-semibold w-1/3">NIP (jika ASN)</label>  
                <input  
                  type="text"  
                  id="nip"  
                  name="nip"  
                  value={formData.nip}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                />   
              </div>
              <div className="mb-4 flex items-center">  
                <label htmlFor="namaAnak" className="block text-sm font-semibold w-1/3">Nama Anak</label>  
                <input  
                  type="text"  
                  id="namaAnak"  
                  name="namaAnak"  
                  value={formData.namaAnak}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Jenis Kelamin</label>  
                <div className="w-2/3 flex items-center">  
                  <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="jenisKelamin"  
                      value="L"  
                      checked={formData.jenisKelamin === "L"}  
                      onChange={handleChange}  
                    />  
                    Laki-laki  
                  </label>  
                  <label>  
                    <input  
                      type="radio"  
                      name="jenisKelamin"  
                      value="P"  
                      checked={formData.jenisKelamin === "P"}  
                      onChange={handleChange}  
                    />  
                    Perempuan  
                  </label>  
                </div>  
              </div>  
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Bekerja di LAN</label>  
                <div className="w-2/3 flex items-center">  
                  <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="isASNSatuInstansi"  
                      value="true"  
                      checked={formData.isASNSatuInstansi === true}  
                      onChange={handleChange}  
                    />  
                    Ya  
                  </label>  
                  <label>  
                    <input  
                      type="radio"  
                      name="isASNSatuInstansi"  
                      value="false"  
                      checked={formData.isASNSatuInstansi === false}  
                      onChange={handleChange}  
                    />  
                    Tidak  
                  </label>  
                </div>  
              </div> 
              <div className="mb-4 flex items-center">  
                <label htmlFor="tempatLahir" className="block text-sm font-semibold w-1/3">Tempat Lahir</label>  
                <input  
                  type="text"  
                  id="tempatLahir"  
                  name="tempatLahir"  
                  value={formData.tempatLahir}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="tanggalLahir" className="block text-sm font-semibold w-1/3">Tanggal Lahir</label>  
                <input  
                  type="date"  
                  id="tanggalLahir"  
                  name="tanggalLahir"  
                  value={formData.tanggalLahir}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Status Perkawinan</label>  
                <select  
                  id="statusPerkawinan"  
                  name="statusPerkawinan"  
                  value={formData.statusPerkawinan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih Status Perkawinan</option>  
                  <option value="2">Belum menikah</option> 
                  <option value="1">Menikah</option>  
                  <option value="3">Cerai hidup</option>  
                  <option value="4">Cerai mati</option>
                </select> 
              </div>  
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Memperoleh Tunjangan</label>  
                <div className="w-2/3 flex items-center">  
                  <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="memperolehTunjangan"  
                      value="true"
                      checked={formData.memperolehTunjangan === true}  
                      onChange={handleChange}  
                    />  
                    Ya  
                  </label>  
                  <label>  
                    <input  
                      type="radio"  
                      name="memperolehTunjangan"  
                      value="false"  
                      checked={formData.memperolehTunjangan === false}  
                      onChange={handleChange}  
                    />  
                    Tidak  
                  </label>  
                </div>  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="pendidikan" className="block text-sm font-semibold w-1/3">Pendidikan</label>  
                <select  
                  id="pendidikan"  
                  name="pendidikan"  
                  value={formData.pendidikan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih Pendidikan</option>  
                  <option value="Tidak tahu">Tidak tahu</option> 
                  <option value="Tidak/belum bersekolah">Tidak/Belum Bersekolah</option>  
                  <option value="SD">SD/MI/Sederajat</option>  
                  <option value="SLTP">SMP/MTs/Sederajat</option>  
                  <option value="SLTA">SMA/SMK/MA/MAK/Sederajat</option>  
                  <option value="D1">Diploma I</option>  
                  <option value="D2">Diploma II</option>  
                  <option value="D3">Diploma III</option> 
                  <option value="D4">Diploma IV</option> 
                  <option value="S1">S1</option>  
                  <option value="S2">S2</option>  
                  <option value="S3">S3</option> 
                </select>  
                </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="pekerjaan" className="block text-sm font-semibold w-1/3">Pekerjaan</label>  
                <input  
                  type="text"  
                  id="pekerjaan"  
                  name="pekerjaan"  
                  value={formData.pekerjaan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="aktaAnak" className="block text-sm font-semibold w-1/3">File Akta Anak</label>  
                <input  
                  type="file"  
                  id="aktaAnak"  
                  name="aktaAnak"  
                  onChange={handleFileChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                />  
              </div>  
              <div className="flex justify-between">  
                <button  
                  type="button"  
                  onClick={closeModals}  
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"  
                >  
                  Batal  
                </button>  
                <button  
                  type="submit"  
                  className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
                >  
                  Simpan  
                </button>  
              </div>  
            </form>  
          </div>  
        </div>  
      )}  

{isEditModalOpen && (  
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">  
          <div className="bg-white p-8 rounded-lg w-1/3">  
            <h3 className="text-xl font-semibold mb-4">Edit Data Anak</h3>  
            <form onSubmit={handleSubmit}>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="nik" className="block text-sm font-semibold w-1/3">NIK</label>  
                <input  
                  type="text"  
                  id="nik"  
                  name="nik"  
                  value={formData.nik}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />   
              </div>
              <div className="mb-4 flex items-center">  
                <label htmlFor="nip" className="block text-sm font-semibold w-1/3">NIP (jika ASN)</label>  
                <input  
                  type="text"  
                  id="nip"  
                  name="nip"  
                  value={formData.nip}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                />   
              </div>
              <div className="mb-4 flex items-center">  
                <label htmlFor="namaAnak" className="block text-sm font-semibold w-1/3">Nama Anak</label>  
                <input  
                  type="text"  
                  id="namaAnak"  
                  name="namaAnak"  
                  value={formData.namaAnak}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Jenis Kelamin</label>  
                <div className="w-2/3 flex items-center">  
                  <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="jenisKelamin"  
                      value="L"  
                      checked={formData.jenisKelamin === "L"}  
                      onChange={handleChange}  
                    />  
                    Laki-laki  
                  </label>  
                  <label>  
                    <input  
                      type="radio"  
                      name="jenisKelamin"  
                      value="P"  
                      checked={formData.jenisKelamin === "P"}  
                      onChange={handleChange}  
                    />  
                    Perempuan  
                  </label>  
                </div>  
              </div>  
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Bekerja di LAN</label>  
                <div className="w-2/3 flex items-center">  
                  <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="isASNSatuInstansi"  
                      value="true"  
                      checked={formData.isASNSatuInstansi === true}  
                      onChange={handleChange}  
                    />  
                    Ya  
                  </label>  
                  <label>  
                    <input  
                      type="radio"  
                      name="isASNSatuInstansi"  
                      value="false"  
                      checked={formData.isASNSatuInstansi === false}  
                      onChange={handleChange}  
                    />  
                    Tidak  
                  </label>  
                </div>  
              </div> 
              <div className="mb-4 flex items-center">  
                <label htmlFor="tempatLahir" className="block text-sm font-semibold w-1/3">Tempat Lahir</label>  
                <input  
                  type="text"  
                  id="tempatLahir"  
                  name="tempatLahir"  
                  value={formData.tempatLahir}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="tanggalLahir" className="block text-sm font-semibold w-1/3">Tanggal Lahir</label>  
                <input  
                  type="date"  
                  id="tanggalLahir"  
                  name="tanggalLahir"  
                  value={formData.tanggalLahir}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Status Perkawinan</label>  
                <select  
                  id="statusPerkawinan"  
                  name="statusPerkawinan"  
                  value={formData.statusPerkawinan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih Status Perkawinan</option>  
                  <option value="2">Belum menikah</option> 
                  <option value="1">Menikah</option>  
                  <option value="3">Cerai hidup</option>  
                  <option value="4">Cerai mati</option>
                </select> 
              </div> 
              <div className="mb-4 flex items-center">  
                <label className="block text-sm font-semibold w-1/3">Memperoleh Tunjangan</label>  
                <div className="w-2/3 flex items-center">  
                  <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="memperolehTunjangan"  
                      value="true"
                      checked={formData.memperolehTunjangan === true}  
                      onChange={handleChange}  
                    />  
                    Ya  
                  </label>  
                  <label>  
                    <input  
                      type="radio"  
                      name="memperolehTunjangan"  
                      value="false"  
                      checked={formData.memperolehTunjangan === false}  
                      onChange={handleChange}  
                    />  
                    Tidak  
                  </label>  
                </div>  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="pendidikan" className="block text-sm font-semibold w-1/3">Pendidikan</label>  
                <select  
                  id="pendidikan"  
                  name="pendidikan"  
                  value={formData.pendidikan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih Pendidikan</option>  
                  <option value="Tidak tahu">Tidak tahu</option> 
                  <option value="Tidak/belum bersekolah">Tidak/Belum Bersekolah</option>  
                  <option value="SD">SD/MI/Sederajat</option>  
                  <option value="SLTP">SMP/MTs/Sederajat</option>  
                  <option value="SLTA">SMA/SMK/MA/MAK/Sederajat</option>  
                  <option value="D1">Diploma I</option>  
                  <option value="D2">Diploma II</option>  
                  <option value="D3">Diploma III</option> 
                  <option value="D4">Diploma IV</option> 
                  <option value="S1">S1</option>  
                  <option value="S2">S2</option>  
                  <option value="S3">S3</option> 
                </select>  
                </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="pekerjaan" className="block text-sm font-semibold w-1/3">Pekerjaan</label>  
                <input  
                  type="text"  
                  id="pekerjaan"  
                  name="pekerjaan"  
                  value={formData.pekerjaan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="aktaAnak" className="block text-sm font-semibold w-1/3">File Akta Anak</label>  
                <input  
                  type="file"  
                  id="aktaAnak"  
                  name="aktaAnak"  
                  onChange={handleFileChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                />  
              </div>  
              <div className="flex justify-between">  
                <button  
                  type="button"  
                  onClick={closeModals}  
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"  
                >  
                  Batal  
                </button>  
                <button  
                  type="submit"  
                  className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
                >  
                  Update  
                </button>  
              </div>  
            </form>  
          </div>  
        </div>  
      )}  

    </div>  
  );  
};  
  
export default RiwayatAnak;  
