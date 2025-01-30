"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Riwayatpublikasi = () => {
  interface DataPublikasi {
    No: number;
    publikasi_id: number; // Use publikasi_id as the unique identifier
    judul: string;
    penerbit: string;
    Tahunterbit: string;
    Levelpenerbit: string;
    Linkpublikasi: string;
  }

  const [data, setData] = useState<DataPublikasi[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataPublikasi>({
    No: 0,
    publikasi_id: 0,
    judul: "",
    penerbit: "",
    Tahunterbit: "",
    Levelpenerbit: "",
    Linkpublikasi: "",
  });

  const fetchRiwayatPublikasi = async (nip: string) => {
    try {
      const response = await axios.get(`/api/kinerja/publikasi?peg_id=${nip}`);
      const mappedData = response.data.map((item: any, index: number) => ({
        No: index + 1,
        publikasi_id: item.publikasi_id, // Use publikasi_id
        judul: item.judul,
        penerbit: item.penerbit,
        Tahunterbit: item.tahun_terbit,
        Levelpenerbit: item.level_penerbit,
        Linkpublikasi: item.link_publikasi,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      fetchRiwayatPublikasi(nip);
    }
  }, [nip]);

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
        judul: formData.judul,
        penerbit: formData.penerbit,
        tahun_terbit: formData.Tahunterbit,
        level_penerbit: formData.Levelpenerbit,
        link_publikasi: formData.Linkpublikasi,
      };

      if (formData.publikasi_id) { // Use publikasi_id for editing
        await axios.put(`/api/kinerja/publikasi/${formData.publikasi_id}`, payload);
      } else {
        await axios.post(`/api/kinerja/publikasi`, payload);
      }
      fetchRiwayatPublikasi(nip!);
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);
    }
  };

  const handleEdit = (item: DataPublikasi) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (publikasi_id: number) => {
    const confirmDelete = window.confirm("Apakah anda yakin akan menghapus publikasi ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/kinerja/publikasi/${publikasi_id}`); // Use the correct endpoint
        fetchRiwayatPublikasi(nip!);
      } catch (error) {
        console.error("Error deleting publication:", error);
      }
    }
  };

  const openAddModal = () => {
    setFormData({ No: 0, publikasi_id: 0, judul: "", penerbit: "", Tahunterbit: "", Levelpenerbit: "Nasional", Linkpublikasi: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="cuti" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">Riwayat Publikasi</h3>

      <div className="flex justify-end mb-4">
        <button onClick={openAddModal} className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-[#f2bd1d]">No</th>
            <th className="p-3 border border-[#f2bd1d]">Judul</th>
            <th className="p-3 border border-[#f2bd1d]">Penerbit</th>
            <th className="p-3 border border-[#f2bd1d]">Tahun Terbit</th>
            <th className="p-3 border border-[#f2bd1d]">Level Penerbit</th>
            <th className="p-3 border border-[#f2bd1d]">Link Publikasi</th>
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.publikasi_id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-[#f2bd1d]">{item.No}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.judul}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.penerbit}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.Tahunterbit}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.Levelpenerbit}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.Linkpublikasi}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button onClick={() => handleEdit(item)} className="text-green-500 hover:text-green-700" aria-label="Edit">
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.publikasi_id)} className="text-red-500 hover:text-red-700" aria-label="Delete">
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Adding/Editing Publication */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">{formData.publikasi_id ? "Edit Data Publikasi" : "Tambah Data Publikasi"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <label htmlFor="judul" className="block text-sm font-semibold w-1/3">Judul</label>
                <input
                  type="text"
                  id="judul"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="penerbit" className="block text-sm font-semibold w-1/3">Penerbit</label>
                <input
                  type="text"
                  id="penerbit"
                  name="penerbit"
                  value={formData.penerbit}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="Tahunterbit" className="block text-sm font-semibold w-1/3">Tahun Terbit</label>
                <input
                  type="text"
                  id="Tahunterbit"
                  name="Tahunterbit"
                  value={formData.Tahunterbit}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-sm font-semibold w-1/3">Level Penerbit</label>
                <div className="flex items-center w-2/3">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="Levelpenerbit"
                      value="nasional"
                      checked={formData.Levelpenerbit === "nasional"}
                      onChange={handleChange}
                    />
                    Nasional
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="Levelpenerbit"
                      value="internasional"
                      checked={formData.Levelpenerbit === "internasional"}
                      onChange={handleChange}
                    />
                    Internasional
                  </label>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="Linkpublikasi" className="block text-sm font-semibold w-1/3">Link Publikasi</label>
                <input
                  type="text"
                  id="Linkpublikasi"
                  name="Linkpublikasi"
                  value={formData.Linkpublikasi}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
                >
                  {formData.publikasi_id ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riwayatpublikasi;
