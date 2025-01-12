"use client";  
  
import React, { useEffect, useState } from "react";  
import axios from "axios";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faEdit, faTrash, faPlus, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";  
  
interface Pendidikan {  
  no: number;  
  tingpend: string;  
  jurusan: string;  
  riw_pendidikan_sttb_ijazah: string;  
  riw_pendidikan_tanggal: string;  
  riw_pendidikan_pejabat: string;  
  riw_pendidikan_nm: string;  
  riw_pendidikan_lokasi: string;  
}  
  
interface TingkatPendidikan {  
  nm_tingpend: string;  
}  
  
const RiwayatPendidikan: React.FC<{ nip: string }> = ({ nip }) => {  
  const [dataPendidikan, setDataPendidikan] = useState<Pendidikan[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);  
  const [selectedData, setSelectedData] = useState<Pendidikan | null>(null);  
  const [tingkatPendidikanOptions, setTingkatPendidikanOptions] = useState<TingkatPendidikan[]>([]);  
  
  const formatTanggal = (tanggal: string): string => {  
    const bulanIndo = [  
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",  
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",  
    ];  
  
    const date = new Date(tanggal);  
    const hari = date.getDate();  
    const bulan = bulanIndo[date.getMonth()];  
    const tahun = date.getFullYear();  
  
    return `${hari} - ${bulan} - ${tahun}`;  
  };  
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    if (nipFromUrl) {  
      fetchRiwayatPendidikan(nipFromUrl);  
    }  
  }, []);  
  
  const fetchRiwayatPendidikan = async (nip: string) => {  
    try {  
      setLoading(true);  
      const response = await axios.get(`/api/riwayat/pendidikan?peg_id=${nip}`);  
      const sortedData = response.data;  
  
      const mappedData = sortedData.map((item: any, index: number) => ({  
        no: index + 1,  
        tingpend: item.nm_tingpend,  
        jurusan: item.nama_jurusan,   
        riw_pendidikan_sttb_ijazah: item.riw_pendidikan_sttb_ijazah,  
        riw_pendidikan_tanggal: formatTanggal(item.riw_pendidikan_tgl),  
        riw_pendidikan_pejabat: item.riw_pendidikan_pejabat,  
        riw_pendidikan_nm: item.riw_pendidikan_nm || item.nama_univ,  
        riw_pendidikan_lokasi: item.riw_pendidikan_lokasi,  
      }));  
  
      setDataPendidikan(mappedData);  
    } catch (error) {  
      console.error("Error fetching data:", error);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    const fetchTingkatPendidikan = async () => {  
      try {  
        const response = await axios.get('/api/master_data/pendidikan');  
        const data = response.data;  
        setTingkatPendidikanOptions(data);  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      }  
    };  
  
    fetchTingkatPendidikan();  
  }, []);  
  
  const openModal = (type: "add" | "edit" | "delete", data: Pendidikan | null = null) => {  
    setModalType(type);  
    setSelectedData(data);  
    setIsModalOpen(true);  
  };  
  
  const closeModal = () => {  
    setIsModalOpen(false);  
    setModalType(null);  
    setSelectedData(null);  
  };  
  
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    const formData = new FormData(e.currentTarget);  
    const newData = Object.fromEntries(formData.entries());  
  
    try {  
      await axios.post("/api/riwayat/pendidikan", newData);  
      fetchRiwayatPendidikan(nip);  
      closeModal();  
    } catch (error) {  
      console.error("Error adding data:", error);  
    }  
  };  
  
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    const formData = new FormData(e.currentTarget);  
    const updatedData = Object.fromEntries(formData.entries());  
  
    try {  
      await axios.put(`/api/riwayat/pendidikan?id=${selectedData?.no}`, updatedData);  
      fetchRiwayatPendidikan(nip);  
      closeModal();  
    } catch (error) {  
      console.error("Error editing data:", error);  
    }  
  };  
  
  const handleDelete = async () => {  
    if (!selectedData) return;  
    try {  
      await axios.delete(`/api/riwayat/pendidikan?id=${selectedData.no}`);  
      fetchRiwayatPendidikan(nip);  
      closeModal();  
    } catch (error) {  
      console.error("Error deleting data:", error);  
    }  
  };  
  
  const handleDownload = (fileId: string) => {  
    console.log(`Download file with ID: ${fileId}`);  
  };  
  
  const handleUpload = (fileId: string) => {  
    console.log(`Upload file with ID: ${fileId}`);  
  };  
  
  return (  
    <div id="pendidikan" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">RIWAYAT PENDIDIKAN</h3>  
  
      <div className="flex justify-end mb-4">  
        <button className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]" onClick={() => openModal("add")}>  
          <FontAwesomeIcon icon={faPlus} /> Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr>  
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">No</th>  
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Tingkat Pendidikan</th>  
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Jurusan</th>  
            <th colSpan={3} className="p-3 border border-[#f2bd1d]">STTB/Ijazah</th>  
            <th colSpan={2} className="p-3 border border-[#f2bd1d]">Sekolah/Pendidikan</th>  
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
          <tr>  
            <th className="p-3 border border-[#f2bd1d]">Nomor</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal</th>  
            <th className="p-3 border border-[#f2bd1d]">Pejabat</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama</th>  
            <th className="p-3 border border-[#f2bd1d]">Lokasi</th>  
          </tr>  
        </thead>  
        <tbody>  
          {loading ? (  
            <tr>  
              <td colSpan={9} className="text-center p-4">Memuat data...</td>  
            </tr>  
          ) : dataPendidikan.length === 0 ? (  
            <tr>  
              <td colSpan={9} className="text-center p-4">Data tidak ditemukan.</td>  
            </tr>  
          ) : (  
            dataPendidikan.map((item) => (  
              <React.Fragment key={item.no}>  
                <tr className={item.no % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                  <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.tingpend}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.jurusan}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.riw_pendidikan_sttb_ijazah}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.riw_pendidikan_tanggal}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.riw_pendidikan_pejabat}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.riw_pendidikan_nm}</td>  
                  <td className="p-3 border border-[#f2bd1d]">{item.riw_pendidikan_lokasi}</td>  
                  <td className="p-3 border border-[#f2bd1d]">  
                    <div className="flex space-x-4">  
                      <button  
                        className="text-green-500 hover:text-green-700"  
                        onClick={() => openModal("edit", item)}  
                        aria-label="Edit"  
                      >  
                        <FontAwesomeIcon icon={faEdit} /> Edit  
                      </button>  
                      <button  
                        className="text-red-500 hover:text-red-700"  
                        onClick={() => openModal("delete", item)}  
                        aria-label="Delete"  
                      >  
                        <FontAwesomeIcon icon={faTrash} /> Delete  
                      </button>  
                    </div>  
                  </td>  
                </tr>  
                <tr className="bg-gray-100">  
                  <td colSpan={9} className="p-3">  
                    <button  
                      className="flex items-center justify-center space-x-2 text-blue-500 hover:text-blue-700"  
                      onClick={() => handleUpload(item.riw_pendidikan_sttb_ijazah)}  
                      aria-label="Upload and Download"  
                    >  
                      <FontAwesomeIcon icon={faUpload} />  
                      <span className="text-sm">Upload and Download</span>  
                      <FontAwesomeIcon icon={faDownload} />  
                    </button>  
                  </td>  
                </tr>  
              </React.Fragment>  
            ))  
          )}  
        </tbody>  
      </table>  
  
      {isModalOpen && (  
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">  
          <div className="bg-white p-6 rounded shadow-lg w-1/2">  
            <h3 className="text-lg font-semibold mb-4">  
              {modalType === "add"  
                ? "Tambah Data"  
                : modalType === "edit"  
                ? "Edit Data"  
                : "Hapus Data"}  
            </h3>  
            {modalType === "delete" ? (  
              <div>  
                <p>Apakah Anda yakin ingin menghapus data ini?</p>  
                <div className="mt-4 flex justify-end space-x-4">  
                  <button  
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"  
                    onClick={closeModal}  
                  >  
                    Batal  
                  </button>  
                  <button  
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"  
                    onClick={handleDelete}  
                  >  
                    Hapus  
                  </button>  
                </div>  
              </div>  
            ) : (  
              <form onSubmit={modalType === 'add' ? handleAdd : handleEdit}>  
                <div className="mb-4">  
                  <label className="block font-medium">Tingkat Pendidikan</label>  
                  <select  
                    name="tingpend"  
                    className="border p-2 w-full text-black bg-white"  
                    required  
                  >  
                    <option value="">Pilih Tingkat Pendidikan</option>  
                    {tingkatPendidikanOptions.map((option, index) => (  
                      <option key={index} value={option.nm_tingpend}>  
                        {option.nm_tingpend}  
                      </option>  
                    ))}  
                  </select>  
                </div>  
                <div className="mb-4">  
                  <label className="block font-medium">Nama Sekolah</label>  
                  <input  
                    type="text"  
                    name="jurusan"  
                    className="border p-2 w-full"  
                    defaultValue={selectedData?.jurusan || ''}  
                  />  
                </div>  
                <div className="mb-4">  
                  <label className="block font-medium">Lokasi Sekolah</label>  
                  <input  
                    type="text"  
                    name="riw_pendidikan_lokasi"  
                    className="border p-2 w-full"  
                    defaultValue={selectedData?.riw_pendidikan_lokasi || ''}  
                  />  
                </div>  
                <div className="mb-4">  
                  <label className="block font-medium">Jurusan</label>  
                  <input  
                    type="text"  
                    name="jurusan"  
                    className="border p-2 w-full"  
                    defaultValue={selectedData?.jurusan || ''}  
                  />  
                </div>  
                <div className="mb-4">  
                  <label className="block font-medium">Nomor Ijazah/STTB</label>  
                  <input  
                    type="text"  
                    name="riw_pendidikan_sttb_ijazah"  
                    className="border p-2 w-full"  
                    defaultValue={selectedData?.riw_pendidikan_sttb_ijazah || ''}  
                  />  
                </div>  
                <div className="mb-4">  
                  <label className="block font-medium">Tanggal Ijazah/STTB</label>  
                  <input  
                    type="date"  
                    name="riw_pendidikan_tanggal"  
                    className="border p-2 w-full"  
                    defaultValue={selectedData?.riw_pendidikan_tanggal || ''}  
                  />  
                </div>  
                <div className="mb-4">  
                  <label className="block font-medium">Nama Kepala Sekolah/Rektor</label>  
                  <input  
                    type="text"  
                    name="riw_pendidikan_pejabat"  
                    className="border p-2 w-full"  
                    defaultValue={selectedData?.riw_pendidikan_pejabat || ''}  
                  />  
                </div>  
                <div className="flex justify-end space-x-4">  
                  <button  
                    type="button"  
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"  
                    onClick={closeModal}  
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
            )}  
          </div>  
        </div>  
      )}  
    </div>  
  );  
};  
  
export default RiwayatPendidikan;  
