
'use client';  
import React, { useEffect, useState } from "react";  
import axios from "axios";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faEdit, faTrash, faPlus, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";  
import Modal from "./pendidikanModal"; // Import PendidikanModal  
  
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
  tingpend_id: number;  
  nm_tingpend: string;  
}  
  
interface Jurusan {  
  jurusan_id: number;  
  jurusan_nm: string;  
}  

interface Universitas {  
  univ_id: number;  
  univ_nmpti: string;
  univ_kota: string;  
}
  
const RiwayatPendidikan: React.FC<{ nip: string }> = ({ nip }) => {  
  const [dataPendidikan, setDataPendidikan] = useState<Pendidikan[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);  
  const [selectedData, setSelectedData] = useState<Pendidikan | null>(null);  
  const [tingkatPendidikanOptions, setTingkatPendidikanOptions] = useState<TingkatPendidikan[]>([]);  
  const [jurusanOptions, setJurusanOptions] = useState<Jurusan[]>([]); 
  const [universitasOptions, setUniversitasOptions] = useState<Universitas[]>([]); 
  
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
  
  const fetchRiwayatPendidikan = async (nip: string) => {  
    try {  
      setLoading(true);  
      const response = await axios.get(`/api/riwayat/pendidikan?peg_id=${nip}`);  
      const sortedData = response.data;  
  
        const mappedData = sortedData.map((item: any, index: number) => ({  
          no: index + 1,  
          tingpend: item.nm_tingpend,  
          jurusan: item.jurusan_nm,  
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
          setLoading(false);  
        }  
      };  
  
    useEffect(() => {  
    const fetchTingkatPendidikan = async () => {  
      try {  
        const response = await axios.get('/api/master_data/tingkat_pendidikan');  
        const data = response.data;  
        setTingkatPendidikanOptions(data);  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      }  
    };  
  
    const fetchJurusan = async () => {  
      try {  
        const response = await axios.get('/api/master_data/jurusan');  
        const data = response.data;  
        setJurusanOptions(data);  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      }  
    };  

   const fetchUniversitas = async () => {  
      try {  
        const response = await axios.get('/api/data/universitas');  
        const data = response.data;  
        setUniversitasOptions(data);  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      }  
    };  
    
    fetchRiwayatPendidikan(nip);  
    fetchTingkatPendidikan();  
    fetchJurusan();  
    fetchUniversitas();
  }, [nip]);  
  
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
  
  const handleAdd = async (newData: Pendidikan) => {  
    try {  
      await axios.post("/api/riwayat/pendidikan", newData);  
      fetchRiwayatPendidikan(nip);  
      closeModal();  
    } catch (error) {  
      console.error("Error adding data:", error);  
    }  
  };  
  
  const handleEdit = async (updatedData: Pendidikan) => {  
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
        <Modal  
          isOpen={isModalOpen}  
          onClose={closeModal}  
          modalType={modalType}  
          selectedData={selectedData}  
          tingkatPendidikanOptions={tingkatPendidikanOptions}  
          jurusanOptions={jurusanOptions}  
          universitasOptions={universitasOptions}
          handleAdd={handleAdd}  
          handleEdit={handleEdit}  
          handleDelete={handleDelete}  
        />  
      )}  
    </div>  
  );  
};  
  
export default RiwayatPendidikan;  
