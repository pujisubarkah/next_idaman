"use client";  
import { useEffect, useState, useCallback } from "react";   
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";  
import axios from "axios";  
  
const Riwayatprestasi: React.FC = () => {  
  interface KelompokData {  
    id: number;  
    prestasi_id: number;
    namaPenghargaan: string;  
    tahun: string;  
    peran: string;  
    tingkat: string;  
    instansiPemberi: string;  
  }  

  interface PribadiData {  
    id: number;  
    prestasi_id: number;
    namaPenghargaan: string;  
    tahun: string;
    tingkat: string;  
    instansiPemberi: string;  
  }  
  
  const [kelompokData, setKelompokData] = useState<KelompokData[]>([]);  
  const [pribadiData, setPribadiData] = useState<PribadiData[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  
  const [isAddModalOpenKelompok, setIsAddModalOpenKelompok] = useState(false);
  const [isEditModalOpenKelompok, setIsEditModalOpenKelompok] = useState(false);
  
  const [isAddModalOpenPribadi, setIsAddModalOpenPribadi] = useState(false);
  const [isEditModalOpenPribadi, setIsEditModalOpenPribadi] = useState(false);

  const [formDataKelompok, setFormDataKelompok] = useState({
    prestasi_id: 0,
    namaPenghargaan: "", 
    tahun: "",  
    peran: "",
    tingkat: "", 
    instansiPemberi: "",
  });

  const [formDataPribadi, setFormDataPribadi] = useState({
    prestasi_id: 0,
    namaPenghargaan: "", 
    tahun: "",  
    tingkat: "", 
    instansiPemberi: "",
  });
  
  const fetchRiwayatPrestasiKelompok = async (nip: string) => {  
    try {  
      const response = await axios.get(  
        `/api/riwayat/prestasi_kelompok?peg_id=${nip}`  
      );  

      const mappedData = response.data.map(  
        (item: any, index: number) => ({  
          id: index + 1,  
          prestasi_id: item.prestasi_kelompok_id,
          namaPenghargaan: item.nama_penghargaan,  
          tahun: item.tahun,  
          peran: item.peran,  
          tingkat: item.tingkat,  
          instansiPemberi: item.instansi_pemberi,  
        })  
      );  
      setKelompokData(mappedData);  
    } catch (error) {  
      console.error("Error fetching Prestasi Kelompok data:", error);  
    }  
  };  

  const handleChangeKelompok = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {  
    const { name, value } = e.target;  
    setFormDataKelompok((prevData) => ({  
      ...prevData,  
      [name]: value,  
    }));  
  };

  const handleSubmitKelompok = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        peg_id: nip,
        nama_penghargaan: formDataKelompok.namaPenghargaan,
        tahun: formDataKelompok.tahun,
        peran: formDataKelompok.peran,
        tingkat: formDataKelompok.tingkat,
        instansi_pemberi: formDataKelompok.instansiPemberi,
      };

      console.log("Request Body:", payload);

      if (formDataKelompok.prestasi_id) {
        await axios.put(`/api/riwayat/prestasi_kelompok/${formDataKelompok.prestasi_id}`, payload);
      } else {
        await axios.post("/api/riwayat/prestasi_kelompok", payload);
      }
      fetchRiwayatPrestasiKelompok(nip!);
      closeModals();
    } catch (error) {
      console.error("Error adding Prestasi Kelompok data:", error);
    }
  }
  
  const openAddModalKelompok = () => {
    setIsAddModalOpenKelompok(true);
    setFormDataKelompok({
      prestasi_id: 0,
      namaPenghargaan: "", 
      tahun: "",  
      peran: "",
      tingkat: "", 
      instansiPemberi: "",
    });
  };

  const closeModals = () => {
    setIsAddModalOpenKelompok(false);
    setIsEditModalOpenKelompok(false);
    setIsAddModalOpenPribadi(false);
    setIsEditModalOpenPribadi(false);
  };

  const handleEditKelompok = (item: KelompokData) => {
    setIsEditModalOpenKelompok(true);
    setFormDataKelompok({
      prestasi_id: item.prestasi_id,
      namaPenghargaan: item.namaPenghargaan, 
      tahun: item.tahun,  
      peran: item.peran,
      tingkat: item.tingkat, 
      instansiPemberi: item.instansiPemberi,
    });
    setIsEditModalOpenKelompok(true);
  };

  const handleDeleteKelompok = async (prestasi_id: number) => {
    try {
      await axios.delete(`/api/riwayat/prestasi_kelompok/${prestasi_id}`);
      fetchRiwayatPrestasiKelompok(nip!);
    } catch (error) {
      console.error("Error deleting Prestasi Kelompok data:", error);
    }
  };

  const fetchRiwayatPrestasiPribadi = useCallback(async (nip: string) => {  
    try {  
      const response = await axios.get(  
        `/api/riwayat/prestasi_pribadi?peg_id=${nip}`  
      );  
      const mappedData: PribadiData[] = response.data.map(  
        (item: any, index: number) => ({  
          id: index + 1,  
          prestasi_id: item.prestasi_pribadi_id,
          namaPenghargaan: item.nama_penghargaan,  
          tahun: item.tahun,  
          tingkat: item.tingkat,  
          instansiPemberi: item.instansi_pemberi,  
        })  
      );  
      setPribadiData(mappedData);  
    } catch (error) {  
      console.error("Error fetching Prestasi Pribadi data:", error);  
    }  
  }, []);

  const handleChangePribadi = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {  
    const { name, value } = e.target;  
    setFormDataPribadi((prevData) => ({  
      ...prevData,  
      [name]: value,  
    }));  
  };

  const handleSubmitPribadi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        peg_id: nip,
        nama_penghargaan: formDataPribadi.namaPenghargaan,
        tahun: formDataPribadi.tahun,
        tingkat: formDataPribadi.tingkat,
        instansi_pemberi: formDataPribadi.instansiPemberi,
      };

      console.log("Request Body:", payload);

      if (formDataPribadi.prestasi_id) {
        await axios.put(`/api/riwayat/prestasi_pribadi/${formDataPribadi.prestasi_id}`, payload);
      } else {
        await axios.post("/api/riwayat/prestasi_pribadi", payload);
      }
      fetchRiwayatPrestasiPribadi(nip!);
      closeModals();
    } catch (error) {
      console.error("Error adding Prestasi Individu data:", error);
    }
  }

  const openAddModalPribadi = () => {
    setIsAddModalOpenPribadi(true);
    setFormDataPribadi({
      prestasi_id: 0,
      namaPenghargaan: "", 
      tahun: "", 
      tingkat: "", 
      instansiPemberi: "",
    });
  };
  
  const handleEditPribadi = (item: PribadiData) => {
    setIsEditModalOpenPribadi(true);
    setFormDataPribadi({
      prestasi_id: item.prestasi_id,
      namaPenghargaan: item.namaPenghargaan, 
      tahun: item.tahun, 
      tingkat: item.tingkat, 
      instansiPemberi: item.instansiPemberi,
    });
    setIsEditModalOpenPribadi(true);
  };

  const handleDeletePribadi = async (prestasi_id: number) => {
    try {
      await axios.delete(`/api/riwayat/prestasi_pribadi/${prestasi_id}`);
      fetchRiwayatPrestasiPribadi(nip!);
    } catch (error) {
      console.error("Error deleting Prestasi Kelompok data:", error);
    }
  };
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  
  
    if (nipFromUrl) {  
      fetchRiwayatPrestasiKelompok(nipFromUrl);  
      fetchRiwayatPrestasiPribadi(nipFromUrl);  
    }  
  }, []);  

  
  return (  
    <>
    <div id="prestasiKelompok" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">RIWAYAT PRESTASI KELOMPOK</h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
          onClick={openAddModalKelompok}
        >
          <FaPlus className="inline-block mr-2" />
          Tambah
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr>
            <th className="p-3 border border-[#f2bd1d]">No</th>
            <th className="p-3 border border-[#f2bd1d]">Nama Penghargaan</th>
            <th className="p-3 border border-[#f2bd1d]">Tahun</th>
            <th className="p-3 border border-[#f2bd1d]">Tingkat</th>
            <th className="p-3 border border-[#f2bd1d]">Peran</th>
            <th className="p-3 border border-[#f2bd1d]">Instansi Pemberi</th>
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {kelompokData.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center p-4">
                Data tidak ditemukan.
              </td>
            </tr>
          ) : (
            kelompokData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-[#f2bd1d]">{item.id}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.namaPenghargaan}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tahun}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tingkat}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.peran}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.instansiPemberi}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleEditKelompok(item)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteKelompok(item.prestasi_id)}
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

      {isAddModalOpenKelompok && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Tambah Prestasi Kelompok</h3>
            <form onSubmit={handleSubmitKelompok}>
              <div className="mb-4 flex items-center">
                <label htmlFor="namaPenghargaan" className="block text-sm font-semibold w-1/3">Nama Penghargaan</label>
                <input
                  type="text"
                  id="namaPenghargaan"
                  name="namaPenghargaan"
                  value={formDataKelompok.namaPenghargaan}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="tahun" className="block text-sm font-semibold w-1/3">Tahun</label>
                <input
                  type="text"
                  id="tahun"
                  name="tahun"
                  value={formDataKelompok.tahun}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="tingkat" className="block text-sm font-semibold w-1/3">Tingkat</label>
                <select
                  id="tingkat"
                  name="tingkat"
                  value={formDataKelompok.tingkat}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                >
                  <option value="">Pilih Tingkat</option>
                  <option value="instansi">Instansi</option>
                  <option value="kota">Kota/Kabupaten</option>
                  <option value="provinsi">Provinsi</option>
                  <option value="nasional">Nasional</option>
                  <option value="internasional">Internasional</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="peran" className="block text-sm font-semibold w-1/3">Peran</label>
                <input
                  type="text"
                  id="peran"
                  name="peran"
                  value={formDataKelompok.peran}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="instansiPemberi" className="block text-sm font-semibold w-1/3">Instansi Pemberi</label>
                <input
                  type="text"
                  id="instansiPemberi"
                  name="instansiPemberi"
                  value={formDataKelompok.instansiPemberi}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
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

      {isEditModalOpenKelompok && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Prestasi Kelompok</h3>
            <form onSubmit={handleSubmitKelompok}>
              <div className="mb-4 flex items-center">
                <label htmlFor="namaPenghargaan" className="block text-sm font-semibold w-1/3">Nama Penghargaan</label>
                <input
                  type="text"
                  id="namaPenghargaan"
                  name="namaPenghargaan"
                  value={formDataKelompok.namaPenghargaan}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="tahun" className="block text-sm font-semibold w-1/3">Tahun</label>
                <input
                  type="text"
                  id="tahun"
                  name="tahun"
                  value={formDataKelompok.tahun}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="tingkat" className="block text-sm font-semibold w-1/3">Tingkat</label>
                <select
                  id="tingkat"
                  name="tingkat"
                  value={formDataKelompok.tingkat}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                >
                  <option value="">Pilih Tingkat</option>
                  <option value="instansi">Instansi</option>
                  <option value="kota">Kota/Kabupaten</option>
                  <option value="provinsi">Provinsi</option>
                  <option value="nasional">Nasional</option>
                  <option value="internasional">Internasional</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="peran" className="block text-sm font-semibold w-1/3">Peran</label>
                <input
                  type="text"
                  id="peran"
                  name="peran"
                  value={formDataKelompok.peran}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="instansiPemberi" className="block text-sm font-semibold w-1/3">Instansi Pemberi</label>
                <input
                  type="text"
                  id="instansiPemberi"
                  name="instansiPemberi"
                  value={formDataKelompok.instansiPemberi}
                  onChange={handleChangeKelompok}
                  className="w-2/3 px-4 py-2 border rounded"
                  required />
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
    
    <div id="prestasiIndividu" className="p-8">
        <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">RIWAYAT PRESTASI INDIVIDU</h3>

        <div className="flex justify-end mb-4">
          <button
            className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
            onClick={openAddModalPribadi}
          >
            <FaPlus className="inline-block mr-2" />
            Tambah
          </button>
        </div>

        <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
          <thead className="bg-[#3781c7] text-white">
            <tr>
              <th className="p-3 border border-[#f2bd1d]">No</th>
              <th className="p-3 border border-[#f2bd1d]">Nama Penghargaan</th>
              <th className="p-3 border border-[#f2bd1d]">Tahun</th>
              <th className="p-3 border border-[#f2bd1d]">Tingkat</th>
              <th className="p-3 border border-[#f2bd1d]">Instansi Pemberi</th>
              <th className="p-3 border border-[#f2bd1d]">Pilihan</th>
            </tr>
          </thead>
          <tbody>
            {pribadiData.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center p-4">
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              pribadiData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
                >
                  <td className="p-3 border border-[#f2bd1d]">{item.id}</td>
                  <td className="p-3 border border-[#f2bd1d]">{item.namaPenghargaan}</td>
                  <td className="p-3 border border-[#f2bd1d]">{item.tahun}</td>
                  <td className="p-3 border border-[#f2bd1d]">{item.tingkat}</td>
                  <td className="p-3 border border-[#f2bd1d]">{item.instansiPemberi}</td>
                  <td className="p-3 border border-[#f2bd1d]">
                    <div className="flex space-x-4">
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleEditPribadi(item)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePribadi(item.prestasi_id)}
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

        {isAddModalOpenPribadi && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-1/3">
              <h3 className="text-xl font-semibold mb-4">Tambah Prestasi Individu</h3>
              <form onSubmit={handleSubmitPribadi}>
                <div className="mb-4 flex items-center">
                  <label htmlFor="namaPenghargaan" className="block text-sm font-semibold w-1/3">Nama Penghargaan</label>
                  <input
                    type="text"
                    id="namaPenghargaan"
                    name="namaPenghargaan"
                    value={formDataPribadi.namaPenghargaan}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required />
                </div>
                <div className="mb-4 flex items-center">
                  <label htmlFor="tahun" className="block text-sm font-semibold w-1/3">Tahun</label>
                  <input
                    type="text"
                    id="tahun"
                    name="tahun"
                    value={formDataPribadi.tahun}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required />
                </div>
                <div className="mb-4 flex items-center">
                  <label htmlFor="tingkat" className="block text-sm font-semibold w-1/3">Tingkat</label>
                  <select
                    id="tingkat"
                    name="tingkat"
                    value={formDataPribadi.tingkat}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="instansi">Instansi</option>
                    <option value="kota">Kota/Kabupaten</option>
                    <option value="provinsi">Provinsi</option>
                    <option value="nasional">Nasional</option>
                    <option value="internasional">Internasional</option>
                  </select>
                </div>
                <div className="mb-4 flex items-center">
                  <label htmlFor="instansiPemberi" className="block text-sm font-semibold w-1/3">Instansi Pemberi</label>
                  <input
                    type="text"
                    id="instansiPemberi"
                    name="instansiPemberi"
                    value={formDataPribadi.instansiPemberi}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required />
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

        {isEditModalOpenPribadi && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-1/3">
              <h3 className="text-xl font-semibold mb-4">Edit Prestasi Individu</h3>
              <form onSubmit={handleSubmitPribadi}>
                <div className="mb-4 flex items-center">
                  <label htmlFor="namaPenghargaan" className="block text-sm font-semibold w-1/3">Nama Penghargaan</label>
                  <input
                    type="text"
                    id="namaPenghargaan"
                    name="namaPenghargaan"
                    value={formDataPribadi.namaPenghargaan}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required />
                </div>
                <div className="mb-4 flex items-center">
                  <label htmlFor="tahun" className="block text-sm font-semibold w-1/3">Tahun</label>
                  <input
                    type="text"
                    id="tahun"
                    name="tahun"
                    value={formDataPribadi.tahun}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required />
                </div>
                <div className="mb-4 flex items-center">
                  <label htmlFor="tingkat" className="block text-sm font-semibold w-1/3">Tingkat</label>
                  <select
                    id="tingkat"
                    name="tingkat"
                    value={formDataPribadi.tingkat}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="instansi">Instansi</option>
                    <option value="kota">Kota/Kabupaten</option>
                    <option value="provinsi">Provinsi</option>
                    <option value="nasional">Nasional</option>
                    <option value="internasional">Internasional</option>
                  </select>
                </div>
                <div className="mb-4 flex items-center">
                  <label htmlFor="instansiPemberi" className="block text-sm font-semibold w-1/3">Instansi Pemberi</label>
                  <input
                    type="text"
                    id="instansiPemberi"
                    name="instansiPemberi"
                    value={formDataPribadi.instansiPemberi}
                    onChange={handleChangePribadi}
                    className="w-2/3 px-4 py-2 border rounded"
                    required />
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
    </>
  );  
};  
  
export default Riwayatprestasi;  
