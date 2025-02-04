"use client";  
  
import { useState, useEffect } from "react";  
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";  
import axios from "axios";  
  
const DataOrtu = () => {  
  interface DataOrtu {  
    no: number;  
    id?: number;
    nik: string;  
    nip: string;
    namaOrtu: string;  
    hubungan: string;  
    jenisKelamin: string;  
    tempatLahir: string;  
    tanggalLahir: string;
    isASN: boolean;
    isASNSatuInstansi: boolean;
    pendidikan: string;  
    pekerjaan: string; 
  }  
  
  const [dataOrtu, setDataOrtu] = useState<DataOrtu[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataOrtu>({  
    no: 0,
    id: undefined,
    nik: "",  
    nip: "",
    namaOrtu: "",  
    hubungan: "",  
    jenisKelamin: "",  
    tempatLahir: "", 
    tanggalLahir: new Date().toISOString().split("T")[0],
    isASN: false,
    isASNSatuInstansi: false,
    pendidikan: "",  
    pekerjaan: "",
  });  
  
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
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  
  
    if (nipFromUrl) {  
      fetchRiwayatOrtu(nipFromUrl);  
    }  
  }, []);  
  
  const fetchRiwayatOrtu = async (nip: string) => {  
    try {  
      const response = await axios.get(`/api/riwayat/orangtua?peg_id=${nip}`);  
      const sortedData = response.data.sort((a: any, b: any) =>  
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()  
      );  
  
      const mappedData = sortedData.map((item: any, index: number) => ({  
        no: index + 1, 
        id: item.riw_id,  
        nik: item.nik,  
        nip: item.nip,
        namaOrtu: item.riw_nama,  
        hubungan: item.riw_ket,  
        jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",  
        tempatLahir: item.riw_tempat_lahir,  
        tanggalLahir: formatTanggal(item.riw_tgl_lahir),
        isASN: item.is_asn,
        isASNSatuInstansi: item.is_asn_satu_instansi,
        pendidikan: item.riw_pendidikan,  
        pekerjaan: item.riw_pekerjaan,
      }));  
  
      setDataOrtu(mappedData);  
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
        riw_nama: formData.namaOrtu,  
        riw_ket: formData.hubungan,  
        riw_kelamin: formData.jenisKelamin === "L" ? "L" : "P",  
        riw_tempat_lahir: formData.tempatLahir, 
        riw_tgl_lahir: formData.tanggalLahir,
        is_asn: formData.nip !== null && formData.nip !== "" ? true : false,
        is_asn_satu_instansi: formData.isASNSatuInstansi,
        riw_pendidikan: formData.pendidikan,  
        riw_pekerjaan: formData.pekerjaan,
        riw_status: 3,
      };  
  
      console.log("Request Body:", payload);  
  
      if (formData.id) {  
        await axios.put(`/api/riwayat/orangtua/${formData.id}`, payload);  
      } else {  
        await axios.post(`/api/riwayat/orangtua`, payload);  
      }
      fetchRiwayatOrtu(nip!);  
      closeModals();  
    } catch (error) {  
      console.error("Error saving data:", error.response?.data || error.message);  
    }  
  };  
  
  const handleEdit = (ortu: DataOrtu) => {  
    setFormData({  
      no: ortu.no,
      id: ortu.id,
      nik: ortu.nik,
      nip: ortu.nip,
      namaOrtu: ortu.namaOrtu,
      hubungan: ortu.hubungan,
      jenisKelamin: ortu.jenisKelamin  === "L" ? "L" : "P",
      tempatLahir: ortu.tempatLahir, 
      tanggalLahir: new Date(ortu.tanggalLahir).toISOString().split("T")[0],
      isASN: ortu.isASN,
      isASNSatuInstansi: ortu.isASNSatuInstansi,
      pendidikan: ortu.pendidikan,
      pekerjaan: ortu.pekerjaan,
    });  
    setIsEditModalOpen(true); // Open the edit modal  
  };  
  
  const handleDelete = async (id: number) => {  
    if (confirm("Apakah anda yakin akan menghapus kontak ini?")) {  
      try {  
        await axios.delete(`/api/riwayat/orangtua/${id}`);  
        fetchRiwayatOrtu(nip!);  
      } catch (error) {  
        console.error("Error deleting contact:", error);  
      }  
    }  
  };  
  
  const openAddModal = () => {  
    setIsAddModalOpen(true);  
    setFormData({ no: 0, 
      id: undefined, 
      nik: "",  
      nip: "",
      namaOrtu: "",  
      hubungan: "",  
      jenisKelamin: "",  
      tempatLahir: "",
      tanggalLahir: new Date().toISOString().split("T")[0],
      isASN: false,
      isASNSatuInstansi: false,
      pendidikan: "",  
      pekerjaan: "",}); // Reset form for adding  
  };  
  
  const closeModals = () => {  
    setIsAddModalOpen(false);  
    setIsEditModalOpen(false);  
  };  
  
  return (  
    <div id="ortu" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">DATA ORANG TUA</h3>  
  
      <div className="flex justify-end mb-4">  
        <button onClick={openAddModal} className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">  
          <FaPlus className="inline-block mr-2" />  
          Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr>  
            <th className="p-3 border border-[#f2bd1d]">No</th>  
            <th className="p-3 border border-[#f2bd1d]">NIK/NIP</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama Ortu</th>  
            <th className="p-3 border border-[#f2bd1d]">Hubungan</th>  
            <th className="p-3 border border-[#f2bd1d]">Jenis Kelamin</th>  
            <th className="p-3 border border-[#f2bd1d]">Tempat dan Tanggal Lahir</th>  
            <th className="p-3 border border-[#f2bd1d]">Pendidikan</th>  
            <th className="p-3 border border-[#f2bd1d]">Pekerjaan</th> 
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
        <tbody>  
          {dataOrtu.length === 0 ? (  
            <tr>  
              <td colSpan={10} className="text-center p-4">  
                Data tidak ditemukan.  
              </td>  
            </tr>  
          ) : (  
            dataOrtu.map((item, index) => (  
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nik}<br/>{item.nip}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.namaOrtu}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.hubungan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jenisKelamin}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tempatLahir}, {item.tanggalLahir.toString()}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.pendidikan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.pekerjaan}</td>
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button onClick={() => handleEdit(item)}
                      className="text-green-500 hover:text-green-700"  
                      aria-label="Edit"  
                    >  
                      <FaEdit /> Edit  
                    </button>  
                    <button onClick={() => handleDelete(item.id!)}
                      className="text-red-500 hover:text-red-700"  
                      aria-label="Delete"  
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
            <h3 className="text-xl font-semibold mb-4">Tambah Data Ortu</h3>  
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
                <label htmlFor="nik" className="block text-sm font-semibold w-1/3">NIP</label>  
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
                <label htmlFor="namaOrtu" className="block text-sm font-semibold w-1/3">Nama Ortu</label>  
                <input  
                  type="text"  
                  id="namaOrtu"  
                  name="namaOrtu"  
                  value={formData.namaOrtu}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
                <div className="mb-4 flex items-center">  
                <label htmlFor="hubungan" className="block text-sm font-semibold w-1/3">Hubungan</label>  
                <select  
                  id="hubungan"  
                  name="hubungan"  
                  value={formData.hubungan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih Hubungan</option>  
                  <option value="AYAH">AYAH</option>
                  <option value="IBU">IBU</option>
                </select>  
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
                <label className="block text-sm font-semibold w-1/3">Bekerja di LAN?</label>  
                <div className="w-2/3 flex items-center">  
                    <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="isASNSatuInstansi"  
                      value="true"
                      checked={formData.isASNSatuInstansi === true}  
                      onChange={handleChange}  
                    />  
                    Ya (ASN/Non ASN)
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

    {/* Modal for Editing Ortu*/}
    {isEditModalOpen && (  
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">  
          <div className="bg-white p-8 rounded-lg w-1/3">  
            <h3 className="text-xl font-semibold mb-4">Update Data Ortu</h3>  
            <form onSubmit={handleSubmit}>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="nikNip" className="block text-sm font-semibold w-1/3">NIK</label>  
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
                <label htmlFor="nik" className="block text-sm font-semibold w-1/3">NIP (jika ASN)</label>  
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
                <label htmlFor="namaOrtu" className="block text-sm font-semibold w-1/3">Nama Ortu</label>  
                <input  
                  type="text"  
                  id="namaOrtu"  
                  name="namaOrtu"  
                  value={formData.namaOrtu}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="hubungan" className="block text-sm font-semibold w-1/3">Hubungan</label>  
                <select  
                  id="hubungan"  
                  name="hubungan"  
                  value={formData.hubungan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih Hubungan</option>  
                  <option value="AYAH">AYAH</option>  
                  <option value="IBU">IBU</option>
                </select>  
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
                <label className="block text-sm font-semibold w-1/3">Bekerja di LAN?</label>  
                <div className="w-2/3 flex items-center">  
                  <label className="mr-4">  
                    <input  
                      type="radio"  
                      name="isASNSatuInstansi"  
                      value="true"  
                      checked={formData.isASNSatuInstansi === true}  
                      onChange={handleChange}  
                    />  
                    Ya (ASN/Non ASN)
                  </label>  
                  <label>  
                    <input  
                      type="radio"  
                      name="isASNSatuInstansi"  
                      value="Tidak"  
                      checked={formData.isASNSatuInstansi === false}  
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
  
export default DataOrtu;  
