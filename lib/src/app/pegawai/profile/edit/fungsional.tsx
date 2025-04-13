"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from "react-modal"; // Jika menggunakan react-modal

const RiwayatPelatihanFungsional = () => {
  interface PelatihanFungsional {
    no: number;
    kategori: string;
    nama: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jumlahJam: string;
    nomorSTTP: string;
    tanggalSTTP: string;
    jabatanPenandatangan: string;
    instansi: string;
    lokasi: string;
  }

  const [data, setData] = useState<PelatihanFungsional[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State untuk mengontrol modal
  const [formData, setFormData] = useState<{
    no?: number;
    namaDiklat: string;
    namaDiklatSertifikat: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jumlahJam: string;
    nomorSTTP: string;
    tanggalSTTP: string;
    jabatanPenandatangan: string;
    penyelenggara: string;
    tempat: string;
    fileSertifikat: File | null;
    fileRencanaTindakLanjut: File | null;
  }>({
    namaDiklat: "",
    namaDiklatSertifikat: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    jumlahJam: "",
    nomorSTTP: "",
    tanggalSTTP: "",
    jabatanPenandatangan: "",
    penyelenggara: "",
    tempat: "",
    fileSertifikat: null as File | null,
    fileRencanaTindakLanjut: null as File | null,
  });
  const [isEditing, setIsEditing] = useState(false); // State untuk menentukan apakah sedang edit

  // Fungsi untuk membuka modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalIsOpen(false);
    setIsEditing(false); // Reset state edit saat modal ditutup
    setFormData({
      namaDiklat: "",
      namaDiklatSertifikat: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      jumlahJam: "",
      nomorSTTP: "",
      tanggalSTTP: "",
      jabatanPenandatangan: "",
      penyelenggara: "",
      tempat: "",
      fileSertifikat: null,
      fileRencanaTindakLanjut: null,
    }); // Reset form data saat modal ditutup
  };

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fungsi untuk menangani perubahan file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value instanceof File ? value : value.toString());
      }
    });

    try {
      const response = isEditing
        ? await axios.put(`/api/riwayat/diklat/${formData.no}`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post("/api/riwayat/diklat", formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      console.log("Data berhasil dikirim:", response.data);
      closeModal();
      // Refresh data setelah submit
      if (nip) {
        fetchRiwayatPelatihanfungsional(nip);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    }
  };

  // Fungsi untuk memformat tanggal
  const formatTanggal = (tanggal: string): string => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();
    return `${hari} ${bulan} ${tahun}`;
  };

  const fetchRiwayatPelatihanfungsional = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/diklat?diklat_jenis=2&peg_id=${nip}`);
      const mappedData: PelatihanFungsional[] = response.data.map((item: any, index: number) => ({
        no: index + 1,
        nama: item.diklat_nama,
        tanggalMulai: formatTanggal(item.diklat_mulai),
        tanggalSelesai: formatTanggal(item.diklat_selesai),
        jumlahJam: item.diklat_jumlah_jam,
        nomorSTTP: item.diklat_sttp_no,
        tanggalSTTP: formatTanggal(item.diklat_sttp_tgl),
        jabatanPenandatangan: item.diklat_sttp_pej,
        instansi: item.diklat_penyelenggara,
        lokasi: item.diklat_tempat,
      }));
      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);
  }, []);

  useEffect(() => {
    if (nip) {
      fetchRiwayatPelatihanfungsional(nip);
    }
  }, [nip]);

  // Fungsi untuk mengedit data
  const handleEdit = (item: PelatihanFungsional) => {
    console.log("Edit:", item);
    openModal();
    setIsEditing(true); // Set state edit
    setFormData({
      no: item.no, // Tambahkan no untuk keperluan update
      namaDiklat: item.nama,
      namaDiklatSertifikat: item.nama, // Adjust as needed
      tanggalMulai: item.tanggalMulai,
      tanggalSelesai: item.tanggalSelesai,
      jumlahJam: item.jumlahJam,
      nomorSTTP: item.nomorSTTP,
      tanggalSTTP: item.tanggalSTTP,
      jabatanPenandatangan: item.jabatanPenandatangan,
      penyelenggara: item.instansi,
      tempat: item.lokasi,
      fileSertifikat: null,
      fileRencanaTindakLanjut: null,
    });
  };

  // Fungsi untuk menghapus data
  const handleDelete = async (item: PelatihanFungsional) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const response = await axios.delete(`/api/riwayat/diklat/${item.no}`); // Adjust the endpoint as needed
        console.log("Data berhasil dihapus:", response.data);
        // Refresh data setelah delete
        if (nip) {
          fetchRiwayatPelatihanfungsional(nip);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Terjadi kesalahan saat menghapus data. Silakan coba lagi.");
      }
    }
  };

  return (
    <div id="pelatihan-fungsional" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">
        Riwayat Pelatihan Fungsional
      </h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Tambah/Edit Pelatihan Fungsional"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="modal-overlay"
        style={{
          content: {
            width: "90%", // Adjust width for smaller screens
            maxWidth: "800px",
            maxHeight: "90vh", // Set maximum height
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            overflowY: "auto", // Allow vertical scrolling
          },
        }}
      >
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit" : "Tambah"} Pelatihan Fungsional</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              {[
                { label: "Nama Diklat", name: "namaDiklat", type: "text" },
                { label: "Nama Diklat (sesuai tertera di sertifikat)", name: "namaDiklatSertifikat", type: "text" },
                { label: "Tanggal Mulai", name: "tanggalMulai", type: "date" },
                { label: "Tanggal Selesai", name: "tanggalSelesai", type: "date" },
                { label: "Jumlah Jam", name: "jumlahJam", type: "number" },
                { label: "No. STTP", name: "nomorSTTP", type: "text" },
                { label: "Tanggal STTP", name: "tanggalSTTP", type: "date" },
                { label: "Jabatan Penandatangan STTP", name: "jabatanPenandatangan", type: "text" },
                { label: "Penyelenggara Diklat", name: "penyelenggara", type: "text" },
                { label: "Tempat Diklat", name: "tempat", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} className="flex items-center space-x-4">
                  <label className="block text-sm font-medium w-1/3">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              ))}
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">File Sertifikat</label>
                <input
                  type="file"
                  name="fileSertifikat"
                  onChange={handleFileChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required={!isEditing} // Required only when adding
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">File Rencana Tindak Lanjut</label>
                <input
                  type="file"
                  name="fileRencanaTindakLanjut"
                  onChange={handleFileChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required={!isEditing} // Required only when adding
                />
              </div>
            </div>
            <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mr-2"
                  type="button"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  type="submit"
                >
                  Simpan
                </button>
              </div>
          </form>
        </div>
      </Modal>

      {/* Tabel Data */}
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>No</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Nama Pelatihan Fungsional</th>
            <th className="p-3 border border-[#f2bd1d]" colSpan={2}>Tanggal</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Jumlah Jam</th>
            <th className="p-3 border border-[#f2bd1d]" colSpan={3}>STTP</th>
            <th className="p-3 border border-[#f2bd1d]" colSpan={2}>Instansi Penyelenggara</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Pilihan</th>
          </tr>
          <tr className="bg-[#3781c7] text-white text-sm">
            <th className="p-3 border border-[#f2bd1d]">Mulai</th>
            <th className="p-3 border border-[#f2bd1d]">Selesai</th>
            <th className="p-3 border border-[#f2bd1d]">Nomor</th>
            <th className="p-3 border border-[#f2bd1d]">Tanggal</th>
            <th className="p-3 border border-[#f2bd1d]">Jabatan Penandatangan</th>
            <th className="p-3 border border-[#f2bd1d]">Instansi</th>
            <th className="p-3 border border-[#f2bd1d]">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center p-4">Tidak ada data.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-[#f2bd1d]">{index + 1}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.nomorSTTP}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSTTP}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.lokasi}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button className="text-green-500 hover:text-green-700" aria-label="Edit" onClick={() => handleEdit(item)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700" aria-label="Delete" onClick={() => handleDelete(item)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RiwayatPelatihanFungsional;
