"use client";  
  
import { useState, useEffect } from "react";  
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";  
import axios from "axios";  
  
const KontakDarurat = () => {  
  interface Kontak {  
    no: number;  
    id?: number;  
    nama: string;  
    noTelepon: string;  
    tinggalSerumah: string;  
    hubungan: string;  
    alamat: string;  
  }  
  
  const [kontakDarurat, setKontakDarurat] = useState<Kontak[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  
  const [formData, setFormData] = useState<Kontak>({  
    no: 0,  
    id: undefined,  
    nama: "",  
    noTelepon: "",  
    tinggalSerumah: "",  
    hubungan: "",  
    alamat: "",  
  });  
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  
  
    if (nipFromUrl) {  
      fetchRiwayatKontak(nipFromUrl);  
    }  
  }, []);  
  
  const fetchRiwayatKontak = async (nip: string) => {  
    try {  
      const response = await axios.get(`/api/riwayat/kontak?peg_id=${nip}`);  
      const sortedData = response.data.sort((a: any, b: any) =>  
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()  
      );  
  
      const mappedData = sortedData.map((item: any, index: number) => ({  
        no: index + 1,  
        id: item.id,  
        nama: item.nama,  
        noTelepon: item.no_telepon,  
        tinggalSerumah: item.tinggal_serumah ? "Ya" : "Tidak",  
        hubungan: item.hubungan,  
        alamat: item.alamat,  
      }));  
  
      setKontakDarurat(mappedData);  
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
        nama: formData.nama,  
        no_telepon: formData.noTelepon,  
        tinggal_serumah: formData.tinggalSerumah === "Ya",  
        hubungan: formData.hubungan,  
        alamat: formData.alamat,  
      };  
  
      console.log("Request Body:", payload);  
  
      if (formData.id) {  
        await axios.put(`/api/riwayat/kontak/${formData.id}`, payload);  
      } else {  
        await axios.post(`/api/riwayat/kontak`, payload);  
      }  
      fetchRiwayatKontak(nip!);  
      closeModals();  
    } catch (error) {  
      console.error("Error saving data:", error.response?.data || error.message);  
    }  
  };  
  
  const handleEdit = (contact: Kontak) => {  
    setFormData({  
      no: contact.no,  
      id: contact.id,  
      nama: contact.nama,  
      noTelepon: contact.noTelepon,  
      tinggalSerumah: contact.tinggalSerumah === "Ya" ? "Ya" : "Tidak",  
      hubungan: contact.hubungan,  
      alamat: contact.alamat,  
    });  
    setIsEditModalOpen(true); // Open the edit modal  
  };  
  
  const handleDelete = async (id: number) => {  
    if (confirm("Apakah anda yakin akan menghapus kontak ini?")) {  
      try {  
        await axios.delete(`/api/riwayat/kontak/${id}`);  
        fetchRiwayatKontak(nip!);  
      } catch (error) {  
        console.error("Error deleting contact:", error);  
      }  
    }  
  };  
  
  const openAddModal = () => {  
    setIsAddModalOpen(true);  
    setFormData({ no: 0, id: undefined, nama: "", noTelepon: "", tinggalSerumah: "", hubungan: "", alamat: "" }); // Reset form for adding  
  };  
  
  const closeModals = () => {  
    setIsAddModalOpen(false);  
    setIsEditModalOpen(false);  
  };  
  
  return (  
    <div id="kontak" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">KONTAK DARURAT</h3>  
  
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
            <th className="p-3 border border-[#f2bd1d]">Nama</th>  
            <th className="p-3 border border-[#f2bd1d]">No Telepon</th>  
            <th className="p-3 border border-[#f2bd1d]">Tinggal Serumah</th>  
            <th className="p-3 border border-[#f2bd1d]">Hubungan</th>  
            <th className="p-3 border border-[#f2bd1d]">Alamat</th>  
            <th className="p-3 border border-[#f2bd1d]">Aksi</th>  
          </tr>  
        </thead>  
        <tbody>  
          {kontakDarurat.length === 0 ? (  
            <tr>  
              <td colSpan={7} className="text-center p-4">  
                Data tidak ditemukan.  
              </td>  
            </tr>  
          ) : (  
            kontakDarurat.map((item, index) => (  
              <tr key={item.id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.noTelepon}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tinggalSerumah}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.hubungan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.alamat}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button onClick={() => handleEdit(item)} className="text-green-500 hover:text-green-700" aria-label="Edit">  
                      <FaEdit /> Edit  
                    </button>  
                    <button onClick={() => handleDelete(item.id!)} className="text-red-500 hover:text-red-700" aria-label="Hapus">  
                      <FaTrash /> Hapus  
                    </button>  
                  </div>  
                </td>  
              </tr>  
            ))  
          )}  
        </tbody>  
      </table>  
  
      {/* Modal for Adding Contact */}  
      {isAddModalOpen && (  
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">  
          <div className="bg-white p-8 rounded-lg w-1/3">  
            <h3 className="text-xl font-semibold mb-4">Tambah Kontak Darurat</h3>  
            <form onSubmit={handleSubmit}>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="nama" className="block text-sm font-semibold w-1/3">Nama</label>  
                <input  
                  type="text"  
                  id="nama"  
                  name="nama"  
                  value={formData.nama}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="noTelepon" className="block text-sm font-semibold w-1/3">No Telepon</label>  
                <input  
                  type="text"  
                  id="noTelepon"  
                  name="noTelepon"  
                  value={formData.noTelepon}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="tinggalSerumah" className="block text-sm font-semibold w-1/3">Tinggal Serumah</label>  
                <select  
                  id="tinggalSerumah"  
                  name="tinggalSerumah"  
                  value={formData.tinggalSerumah}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih</option>  
                  <option value="Ya">Ya</option>  
                  <option value="Tidak">Tidak</option>  
                </select>  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="hubungan" className="block text-sm font-semibold w-1/3">Hubungan</label>  
                <input  
                  type="text"  
                  id="hubungan"  
                  name="hubungan"  
                  value={formData.hubungan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="alamat" className="block text-sm font-semibold w-1/3">Alamat</label>  
                <textarea  
                  id="alamat"  
                  name="alamat"  
                  value={formData.alamat}  
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
  
      {/* Modal for Editing Contact */}  
      {isEditModalOpen && (  
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">  
          <div className="bg-white p-8 rounded-lg w-1/3">  
            <h3 className="text-xl font-semibold mb-4">Update Kontak Darurat</h3>  
            <form onSubmit={handleSubmit}>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="nama" className="block text-sm font-semibold w-1/3">Nama</label>  
                <input  
                  type="text"  
                  id="nama"  
                  name="nama"  
                  value={formData.nama}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="noTelepon" className="block text-sm font-semibold w-1/3">No Telepon</label>  
                <input  
                  type="text"  
                  id="noTelepon"  
                  name="noTelepon"  
                  value={formData.noTelepon}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="tinggalSerumah" className="block text-sm font-semibold w-1/3">Tinggal Serumah</label>  
                <select  
                  id="tinggalSerumah"  
                  name="tinggalSerumah"  
                  value={formData.tinggalSerumah}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                >  
                  <option value="">Pilih</option>  
                  <option value="Ya">Ya</option>  
                  <option value="Tidak">Tidak</option>  
                </select>  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="hubungan" className="block text-sm font-semibold w-1/3">Hubungan</label>  
                <input  
                  type="text"  
                  id="hubungan"  
                  name="hubungan"  
                  value={formData.hubungan}  
                  onChange={handleChange}  
                  className="w-2/3 px-4 py-2 border rounded"  
                  required  
                />  
              </div>  
              <div className="mb-4 flex items-center">  
                <label htmlFor="alamat" className="block text-sm font-semibold w-1/3">Alamat</label>  
                <textarea  
                  id="alamat"  
                  name="alamat"  
                  value={formData.alamat}  
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
  
export default KontakDarurat;  
