"use client";  
  
import { useState, useEffect } from "react";  
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";  
import axios from "axios"; 
  
const RiwayatPasangan = () => {  
  interface DataPasangan {  
    no: number;  
    riw_id: number;
    nik: string;  
    nip: string;
    namaPasangan: string;  
    jenisKelamin: string;  
    tempatLahir: string;  
    tanggalLahir: string;
    tanggalNikah: string;  
    isASN: boolean;
    isASNSatuInstansi: boolean;
    statusPerkawinan: string;
    memperolehTunjangan: boolean;  
    pendidikan: string;  
    pekerjaan: string; 
  }  
  
  const [data, setData] = useState<DataPasangan[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  
  const [formData, setFormData] = useState({  
    no: 0,
    riw_id: 0,
    nik: "",  
    nip: "",
    namaPasangan: "",  
    jenisKelamin: "", 
    isASN: false,
    isASNSatuInstansi: false, 
    tempatLahir: "",  
    tanggalLahir: new Date().toISOString().split("T")[0],  
    tanggalNikah: new Date().toISOString().split("T")[0],  
    statusPerkawinan: "",
    memperolehTunjangan: false,  
    pendidikan: "",  
    pekerjaan: "",
  });  
  
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  
  
    if (nipFromUrl) {  
      fetchRiwayatPasangan(nipFromUrl);  
    }  
  }, []);  
  
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
  
  const fetchRiwayatPasangan = async (nip: string) => {  
    try {  
      const response = await axios.get(`/api/riwayat/pasangan?peg_id=${nip}`);  
      const sortedData = response.data.sort((a: any, b: any) =>  
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()  
      );  
  
      const mappedData = sortedData.map((item: any, index: number) => ({  
        no: index + 1,  
        riw_id: item.riw_id,
        nik: item.nik,
        nip: item.nip,  
        namaPasangan: item.riw_nama,  
        jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",  
        tempatLahir: item.riw_tempat_lahir,
        tanggalLahir: formatTanggal(item.riw_tgl_lahir),  
        tanggalNikah: formatTanggal(item.riw_tgl_ket),  
        isASN: item.is_asn,
        isASNSatuInstansi: item.is_asn_satu_instansi,
        statusPerkawinan: item.riw_status_perkawinan === 1 ? "Menikah" : 
              item.riw_status_perkawinan === 3 ? "Cerai hidup" : 
              item.riw_status_perkawinan === 4 ? "Cerai mati" : null,  
        memperolehTunjangan: item.riw_status_tunj ? "Ya" : "Tidak",  
        pendidikan: item.riw_pendidikan,  
        pekerjaan: item.riw_pekerjaan, 
      }));  
  
      setData(mappedData);  
    } catch (error) {  
      console.error("Error fetching data:", error);  
    }  
  };  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {  
    const { name, value } = e.target;  
    setFormData((prevData) => ({  
      ...prevData,  
      [name]: value,  
    }));  
  };  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    try {  
      const payload = {  
        peg_id: nip,  
        nik: formData.nik,  
        nip: formData.nip,
        riw_nama: formData.namaPasangan,  
        riw_ket: formData.jenisKelamin === "L" ? "SUAMI" : "ISTRI",  
        riw_kelamin: formData.jenisKelamin === "L" ? "L" : "P",  
        riw_tempat_lahir: formData.tempatLahir, 
        riw_tgl_lahir: formData.tanggalLahir,
        riw_tgl_ket: formData.tanggalNikah,
        is_asn: formData.nip !== null && formData.nip !== "" ? true : false,
        is_asn_satu_instansi: formData.isASNSatuInstansi,
        riw_status_tunj: formData.memperolehTunjangan,
        riw_status_perkawinan: formData.statusPerkawinan,
        riw_pendidikan: formData.pendidikan,  
        riw_pekerjaan: formData.pekerjaan,
        riw_status: 4,
      };  
  
      console.log("Request Body:", payload);  
  
      if (formData.riw_id) {  
        await axios.put(`/api/riwayat/pasangan/${formData.riw_id}`, payload);  
      } else {  
        await axios.post(`/api/riwayat/pasangan`, payload);  
      }  
      fetchRiwayatPasangan(nip!);  
      closeModals();  
    } catch (error) {  
      console.error("Error saving data:", error.response?.data || error.message);  
    }  
  };  
  
  const openAddModal = () => {  
    setFormData({  
      no: 0,
      riw_id: 0,
      nik: "",  
      nip: "",
      namaPasangan: "",  
      jenisKelamin: "",  
      tempatLahir: "",  
      tanggalLahir: new Date().toISOString().split("T")[0],  
      tanggalNikah: new Date().toISOString().split("T")[0],  
      isASN: false,
      isASNSatuInstansi: false,
      memperolehTunjangan: false,  
      statusPerkawinan: "",
      pendidikan: "",  
      pekerjaan: "", 
    });  
    setIsAddModalOpen(true);  
  };  
  
  const closeModals = () => {  
    setIsAddModalOpen(false);  
    setIsEditModalOpen(false);
  };  
  
  const handleEdit = (item: DataPasangan) => {  
    setFormData({  
      no: item.no,
      riw_id: item.riw_id,
      nik: item.nik,  
      nip: item.nip,
      namaPasangan: item.namaPasangan,  
      jenisKelamin: item.jenisKelamin === "L" ? "L" : "P",  
      tempatLahir: item.tempatLahir,  
      tanggalLahir: isNaN(Date.parse(item.tanggalLahir)) ? "" : new Date(item.tanggalLahir).toISOString().split("T")[0],  
      tanggalNikah: isNaN(Date.parse(item.tanggalNikah)) ? "" : new Date(item.tanggalNikah).toISOString().split("T")[0],  
      isASN: item.isASN,
      isASNSatuInstansi: item.isASNSatuInstansi,
      memperolehTunjangan: item.memperolehTunjangan,  
      statusPerkawinan: item.statusPerkawinan,
      pendidikan: item.pendidikan,  
      pekerjaan: item.pekerjaan,
    });  
    setIsEditModalOpen(true);  
  };  
  
  const handleDelete = async (riw_id: number) => {  
    try {  
      await axios.delete(`/api/riwayat/pasangan/${riw_id}`);  
      fetchRiwayatPasangan(nip!);  
    } catch (error) {  
      console.error("Error deleting data:", error);  
    }  
  };  
  
  return (  
    <div id="pasangan-container">  
      <div id="pasangan" className="p-8">  
        <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">RIWAYAT PASANGAN</h3>  
  
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
              <th className="p-3 border border-[#f2bd1d]">NIK</th>  
              <th className="p-3 border border-[#f2bd1d]">Nama Pasangan</th>  
              <th className="p-3 border border-[#f2bd1d]">Jenis Kelamin</th>  
              <th className="p-3 border border-[#f2bd1d]">Tempat dan Tanggal Lahir</th>  
              <th className="p-3 border border-[#f2bd1d]">Tanggal Nikah</th>  
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
                <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                  <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.nik}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.namaPasangan}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.jenisKelamin}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.tempatLahir}, {item.tanggalLahir.toString()}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.tanggalNikah}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.memperolehTunjangan}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.pendidikan}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.pekerjaan}</td>  
                  <td className="p-3 border border-[#f2bd1d]">  
                    <div className="flex space-x-4">  
                      <button className="text-green-500 hover:text-green-700" onClick={() => handleEdit(item)}>  
                        <FaEdit /> Edit  
                      </button>  
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.riw_id)}>  
                        <FaTrash /> Delete  
                      </button>  
                    </div>  
                  </td>  
                </tr>  
              ))  
            )}  
          </tbody>  
        </table>  
      </div>  
  
      {/* Modal */}  
      {isAddModalOpen && (  
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">  
          <div className="bg-white p-8 rounded-lg w-1/3">  
            <h3 className="text-xl font-semibold mb-4">Tambah Data Pasangan</h3>  
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
                <label htmlFor="namaPasangan" className="block text-sm font-semibold w-1/3">Nama Pasangan</label>  
                <input  
                  type="text"  
                  id="namaPasangan"  
                  name="namaPasangan"  
                  value={formData.namaPasangan}  
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
                <label htmlFor="tanggalNikah" className="block text-sm font-semibold w-1/3">Tanggal Nikah</label>  
                <input  
                  type="date"  
                  id="tanggalNikah"  
                  name="tanggalNikah"  
                  value={formData.tanggalNikah}  
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
                  <option value="1">Menikah</option>  
                  <option value="3">Cerai hidup</option>  
                  <option value="4">Cerai mati</option>
                </select> 
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
            <h3 className="text-xl font-semibold mb-4">Edit Data Pasangan</h3>  
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
                <label htmlFor="namaPasangan" className="block text-sm font-semibold w-1/3">Nama Pasangan</label>  
                <input  
                  type="text"  
                  id="namaPasangan"  
                  name="namaPasangan"  
                  value={formData.namaPasangan}  
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
                <label htmlFor="tanggalNikah" className="block text-sm font-semibold w-1/3">Tanggal Nikah</label>  
                <input  
                  type="date"  
                  id="tanggalNikah"  
                  name="tanggalNikah"  
                  value={formData.tanggalNikah}  
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
                  <option value="1">Menikah</option>  
                  <option value="3">Cerai hidup</option>  
                  <option value="4">Cerai mati</option>
                </select> 
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
    </div>  
  );  
};  
  
export default RiwayatPasangan;  

