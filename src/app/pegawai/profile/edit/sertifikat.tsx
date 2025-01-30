"use client";  
import { useState, useEffect, useCallback } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import axios from "axios";  
import Modal from "react-modal"; // Import Modal

const RiwayatSertifikat = () => {  
  interface DataSertifikat {  
    no: number;  
    nama: string;  
    nomorsurat: string;  
    instansi: string;  
    penandatangan: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    nilai: string;  
  }  

  const [data, setData] = useState<DataSertifikat[]>([]);  
  const [modalIsOpen, setModalIsOpen] = useState(false);  
  const [formData, setFormData] = useState<DataSertifikat | null>(null); // State for form data

  // Fungsi untuk memformat tanggal  
  const formatTanggal = (tanggal: string) => {  
    const bulanIndo = [  
      "Januari",  
      "Februari",  
      "Maret",  
      "April",  
      "Mei",  
      "Juni",  
      "Juli",  
      "Agustus",  
      "September",  
      "Oktober",  
      "November",  
      "Desember",  
    ];  

    const date = new Date(tanggal);  
    const hari = date.getDate();  
    const bulan = bulanIndo[date.getMonth()];  
    const tahun = date.getFullYear();  

    return `${hari} - ${bulan} - ${tahun}`;  
  };  

  const fetchRiwayatSertifikat = useCallback(async () => {  
    try {  
      const response = await axios.get(`/api/riwayat/sertifikat`);  
      const mappedData = response.data.map((item: any, index: number) => ({  
        no: index + 1,  
        nama: item.nama,  
        nomorsurat: item.nomorsurat,  
        instansi: item.instansi,  
        penandatangan: item.penandatangan,  
        tanggalMulai: formatTanggal(item.tanggalMulai),  
        tanggalSelesai: formatTanggal(item.tanggalSelesai),  
        nilai: item.nilai,  
      }));  

      setData(mappedData);  
    } catch (error) {  
      console.error("Error fetching data:", error);  
    }  
  }, []);  

  useEffect(() => {  
    fetchRiwayatSertifikat();  
  }, [fetchRiwayatSertifikat]);  

  // Fungsi untuk membuka modal
  const openModal = (item: DataSertifikat | null) => {
    setFormData(item);
    setModalIsOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalIsOpen(false);
    setFormData(null); // Reset form data
  };

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData) {
        if (formData.no) {
          // Edit existing entry
          await axios.put(`/api/riwayat/sertifikat/${formData.no}`, formData);
        } else {
          // Add new entry
          await axios.post("/api/riwayat/sertifikat", formData);
        }
        closeModal();
        fetchRiwayatSertifikat(); // Refresh data
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Fungsi untuk menghapus sertifikat
  const handleDelete = async (no: number) => {
    try {
      await axios.delete(`/api/riwayat/sertifikat/${no}`);
      fetchRiwayatSertifikat(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (  
    <div id="sertifikat" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
        Riwayat Sertifikat  
      </h3>  

      <div className="flex justify-end mb-4">  
        <button 
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]" 
          onClick={() => openModal(null)} // Open modal for adding new entry
        >  
          <FontAwesomeIcon icon={faPlus} /> Tambah  
        </button>  
      </div>  

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr className="text-sm uppercase">  
            <th className="p-3 border border-[#f2bd1d]">No</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama</th>  
            <th className="p-3 border border-[#f2bd1d]">Nomor Surat</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi</th>  
            <th className="p-3 border border-[#f2bd1d]">Penandatangan</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Nilai</th>  
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={9} className="text-center p-4">  
                Tidak ada data.  
              </td>  
            </tr>  
          ) : (  
            data.map((item, index) => (  
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nomorsurat}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.penandatangan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nilai}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button 
                      className="text-green-500 hover:text-green-700" 
                      aria-label="Edit" 
                      onClick={() => openModal(item)} // Open modal for editing
                    >  
                      <FontAwesomeIcon icon={faEdit} /> Edit  
                    </button>  
                    <button 
                      className="text-red-500 hover:text-red-700" 
                      aria-label="Delete" 
                      onClick={() => handleDelete(item.no)} // Delete entry
                    >  
                      <FontAwesomeIcon icon={faTrash} /> Delete  
                    </button>  
                  </div>  
                </td>  
              </tr>  
            ))  
          )}  
        </tbody>  
      </table>  

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Tambah/Edit Sertifikat"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="modal-overlay"
        style={{
          content: {
            width: "90%",
            maxWidth: "600px",
            maxHeight: "60vh",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
          },
        }}
      >
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{formData ? "Edit" : "Tambah"} Sertifikat</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData?.nama || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Nomor Surat</label>
                <input
                  type="text"
                  name="nomorsurat"
                  value={formData?.nomorsurat || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Instansi</label>
                <input
                  type="text"
                  name="instansi"
                  value={formData?.instansi || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Penandatangan</label>
                <input
                  type="text"
                  name="penandatangan"
                  value={formData?.penandatangan || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Tanggal Mulai</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={formData?.tanggalMulai || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Tanggal Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData?.tanggalSelesai || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Nilai</label>
                <input
                  type="text"
                  name="nilai"
                  value={formData?.nilai || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 mr-2"
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
        </div>
      </Modal>
    </div>  
  );  
};  
  
export default RiwayatSertifikat;
