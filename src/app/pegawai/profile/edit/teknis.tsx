"use client";  
import { useState, useEffect, useCallback } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import axios from "axios";  
import Modal from "react-modal"; // Import Modal

const RiwayatPelatihanTeknis = () => {  
  // Definisi tipe data untuk state  
  interface PelatihanTeknis {  
    no: number;  
    kategori: string;  
    nama: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    jumlahJam: number;  
    jabatanPenandatangan: string;  
    instansi: string;  
    lokasi: string;  
  }  

  const [data, setData] = useState<PelatihanTeknis[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  const [modalIsOpen, setModalIsOpen] = useState(false);  
  const [formData, setFormData] = useState<PelatihanTeknis | null>(null); // State for form data

  // Fungsi untuk memformat tanggal  
  const formatTanggal = (tanggal: string): string => {  
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

    return `${hari} ${bulan} ${tahun}`;  
  };  

  const fetchRiwayatPelatihan = useCallback(async (nip: string) => {  
    try {  
      const response = await axios.get(  
        `/api/riwayat/diklat?diklat_jenis=3&peg_id=${nip}`  
      );  
      const sortedData = response.data.sort(  
        (a: any, b: any) =>  
          new Date(a.diklat_mulai).getTime() -  
          new Date(b.diklat_mulai).getTime()  
      );  

      const mappedData: PelatihanTeknis[] = sortedData.map(  
        (item: any, index: number) => ({  
          no: index + 1,  
          kategori: item.diklat_jenis.diklat_jenis_nama,  
          nama: `${item.diklat_teknis ? item.diklat_teknis.diklat_teknis_nm : "Tidak Ada"} - ${item.diklat_nama || "Tidak Ada"}`,  
          tanggalMulai: formatTanggal(item.diklat_mulai),  
          tanggalSelesai: formatTanggal(item.diklat_selesai),  
          jumlahJam: item.diklat_jumlah_jam,  
          jabatanPenandatangan: item.diklat_sttp_pej || "Tidak Ada",  
          instansi: item.diklat_penyelenggara,  
          lokasi: item.diklat_tempat,  
        })  
      );  

      setData(mappedData);  
    } catch (error) {  
      console.error("Error fetching data:", error);  
    }  
  }, []);  

  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  

    if (nipFromUrl) {  
      fetchRiwayatPelatihan(nipFromUrl);  
    }  
  }, [fetchRiwayatPelatihan]);  

  // Fungsi untuk membuka modal
  const openModal = (item: PelatihanTeknis | null) => {
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
          await axios.put(`/api/riwayat/diklat/${formData.no}`, formData);
        } else {
          // Add new entry
          await axios.post("/api/riwayat/diklat", formData);
        }
        closeModal();
        fetchRiwayatPelatihan(nip!); // Refresh data
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (  
    <div id="pelatihan-teknis" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
        Riwayat Pelatihan Teknis  
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
            <th className="p-3 border border-[#f2bd1d]">Kategori</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama Pelatihan Teknis</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Jumlah Jam</th>  
            <th className="p-3 border border-[#f2bd1d]">Jabatan Penandatangan</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi Penyelenggara</th>  
            <th className="p-3 border border-[#f2bd1d]">Lokasi</th>  
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={10} className="text-center p-4">  
                Tidak ada data.  
              </td>  
            </tr>  
          ) : (  
            data.map((item, index) => (  
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.kategori}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jabatanPenandatangan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.lokasi}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button 
                      className="text-green-500 hover:text-green-700" 
                      aria-label="Edit" 
                      onClick={() => openModal(item)} // Open modal for editing
                    >  
                      <FontAwesomeIcon icon={faEdit} /> Edit  
                    </button>  
                    <button className="text-red-500 hover:text-red-700" aria-label="Delete">  
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
  contentLabel="Tambah/Edit Pelatihan Teknis"
  className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
  overlayClassName="modal-overlay"
  style={{
    content: {
      width: "90%",
      maxWidth: "800px",
      maxHeight: "90vh",
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
    <h2 className="text-xl font-semibold mb-4">{formData ? "Edit" : "Tambah"} Pelatihan Teknis</h2>
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4">
        {[
          { label: "Kategori", name: "kategori", type: "text" },
          { label: "Nama Pelatihan Teknis", name: "nama", type: "text" },
          { label: "Tanggal Mulai", name: "tanggalMulai", type: "date" },
          { label: "Tanggal Selesai", name: "tanggalSelesai", type: "date" },
          { label: "Jumlah Jam", name: "jumlahJam", type: "number" },
          { label: "Jabatan Penandatangan", name: "jabatanPenandatangan", type: "text" },
          { label: "Instansi Penyelenggara", name: "instansi", type: "text" },
          { label: "Lokasi", name: "lokasi", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} className="flex items-center space-x-4">
            <label className="block text-sm font-medium w-1/3">{label}</label>
            <input
              type={type}
              name={name}
              value={formData?.[name] || ""}
              onChange={handleInputChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>
        ))}
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
  
export default RiwayatPelatihanTeknis;  
