
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// Interface untuk data assessmen
export interface DataAssessmen {
    no: number;
    namaAssessmen: string;
    tanggal: string;
    instrumen: string;
    resume: string;
    fileLaporan?: File; // Properti baru untuk file upload
    isNew?: boolean; // Indikator data baru
  }

const RiwayatAssessmen = () => {
  const [data, setData] = useState<DataAssessmen[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataAssessmen>({
    no: 0,
    namaAssessmen: "",
    tanggal: "",
    instrumen: "",
    resume: "",
  });

  const formatTanggal = (tanggal: string) => {
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

  const fetchRiwayatAssessmen = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/assessmen?peg_id=${nip}`);
      const sortedData = response.data.sort(
        (a: any, b: any) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      );

      const mappedData = sortedData.map((item: any, index: number) => ({
        no: index + 1,
        namaAssessmen: item.nama_assessmen,
        tanggal: formatTanggal(item.tanggal),
        instrumen: item.instrumen,
        resume: item.resume,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal mengambil data. Silakan coba lagi nanti.");
    }
  };

  const handleOpenModal = (item?: DataAssessmen) => {
    setFormData(item ? { ...item } : {
      no: 0,
      namaAssessmen: "",
      tanggal: "",
      instrumen: "",
      resume: "",
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const validateFormData = (data: DataAssessmen) => {
    if (!data.namaAssessmen || !data.tanggal || !data.instrumen || !data.resume) {
      alert("Mohon lengkapi semua field.");
      return false;
    }
    return true;
  };

  const handleSubmitForm = async () => {
    try {
      if (!validateFormData(formData)) return;

      if (formData.no === 0) {
        const newData = { ...formData, isNew: true };
        await axios.post("/api/riwayat/assessmen", newData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.put(`/api/riwayat/assessmen/${formData.no}`, formData);
      }
      fetchRiwayatAssessmen(nip!);
      setModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
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
      fetchRiwayatAssessmen(nip);
    }
  }, [nip]);

  return (
    <div id="riwayat-assessmen" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">Riwayat Assessmen</h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
          onClick={() => handleOpenModal()}
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah 
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-[#f2bd1d]">No</th>
            <th className="p-3 border border-[#f2bd1d]">Nama Assessmen</th>
            <th className="p-3 border border-[#f2bd1d]">Tanggal</th>
            <th className="p-3 border border-[#f2bd1d]">Instrumen</th>
            <th className="p-3 border border-[#f2bd1d]">Resume</th>
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4">Tidak ada data.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={item.isNew ? "bg-red-200" : (index % 2 === 0 ? "bg-teal-50" : "bg-white")}>
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.namaAssessmen}</td>
                <td className="p-3 border border-[#f2bd1d]">{formatTanggal(item.tanggal)}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.instrumen}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.resume}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleOpenModal(item)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={async () => {
                        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                          try {
                            await axios.delete(`/api/riwayat/assessmen/${item.no}`);
                            fetchRiwayatAssessmen(nip!);
                          } catch (error) {
                            console.error("Error deleting data:", error);
                            alert("Gagal menghapus data. Silakan coba lagi.");
                          }
                        }
                      }}
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
{/* Modal untuk menambah/edit data assessmen */}
{modalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h4 className="text-lg font-semibold mb-4">
        {formData.no === 0 ? "Tambah Data Assessmen" : "Edit Data Assessmen"}
      </h4>
      <div className="space-y-4">
        {/* Nama Assessmen */}
        <div className="flex items-center">
          <label className="w-1/3">Nama Assessmen</label>
          <input
            type="text"
            value={formData.namaAssessmen}
            onChange={(e) => setFormData({ ...formData, namaAssessmen: e.target.value })}
            className="border border-gray-300 p-2 w-2/3 rounded"
          />
        </div>

        {/* Tanggal Pelaksanaan Asesmen */}
        <div className="flex items-center">
          <label className="w-1/3">Tanggal</label>
          <input
            type="date"
            value={formData.tanggal}
            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
            className="border border-gray-300 p-2 w-2/3 rounded"
          />
        </div>

        {/* Instrumen Asesmen */}
        <div className="flex items-center">
          <label className="w-1/3">Instrumen</label>
          <input
            type="text"
            value={formData.instrumen}
            onChange={(e) => setFormData({ ...formData, instrumen: e.target.value })}
            className="border border-gray-300 p-2 w-2/3 rounded"
          />
        </div>

        {/* Resume */}
        <div className="flex items-center">
          <label className="w-1/3">Resume</label>
          <textarea
            value={formData.resume}
            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
            className="border border-gray-300 p-2 w-2/3 rounded"
            rows={3}
          />
        </div>

        {/* File Laporan Asesmen */}
        <div className="flex items-center">
          <label className="w-1/3">File Laporan Asesmen</label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFormData({ ...formData, fileLaporan: e.target.files[0] });
              }
            }}
            className="border border-gray-300 p-2 w-2/3 rounded"
          />
        </div>
      </div>

      {/* Tombol Simpan dan Batal */}
      <div className="flex justify-end mt-6">
        <button
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c] mr-2"
          onClick={handleSubmitForm}
        >
          Simpan
        </button>
        <button
          className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
          onClick={handleCloseModal}
        >
          Batal
        </button>
      </div>
    </div>
  </div>
)}
         
    </div>
  );
};

export default RiwayatAssessmen;