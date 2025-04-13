"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Select from "react-select"; // Import Select if needed

const RiwayatPltplh = () => {
  interface RiwayatPltplhData {
    id: number;
    nama: string;
    unitkerja: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jenis: string;
    status: string;
  }

  const [data, setData] = useState<RiwayatPltplhData[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<RiwayatPltplhData>({
    id: 0,
    nama: '',
    unitkerja: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    jenis: 'PLT',
    status: 'Aktif',
  });

  const fetchRiwayatPltplh = useCallback(async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/pltplh?peg_id=${nip}`);
      const mappedData: RiwayatPltplhData[] = response.data.map((item: any, index: number) => ({
        id: index + 1,
        nama: item.jabatan.jabatan_nama,
        unitkerja: item.unit_kerja_nama,
        tanggalMulai: item.tanggal_mulai,
        tanggalSelesai: item.tanggal_selesai,
        jenis: item.jenis.toUpperCase(),
        status: item.status,
      }));
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
      fetchRiwayatPltplh(nipFromUrl);
    }
  }, [fetchRiwayatPltplh]);

  const openModal = (isEdit: boolean, data: RiwayatPltplhData | null = null) => {
    setIsModalOpen(true);
    setIsEditMode(isEdit);
    if (isEdit && data) {
      setFormData(data);
    } else {
      setFormData({
        id: 0,
        nama: '',
        unitkerja: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        jenis: 'PLT',
        status: 'Aktif',
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing data
        await axios.put(`/api/riwayat/pltplh/${formData.id}`, formData);
      } else {
        // Add new data
        await axios.post(`/api/riwayat/pltplh`, formData);
      }
      fetchRiwayatPltplh(nip!); // Refresh data
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div id="pltplh" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">Riwayat PLT/PLH</h3>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal(false)}
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
        >
          <FontAwesomeIcon icon={faPlus} className="inline-block mr-2" /> Tambah
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-[#f2bd1d]">No</th>
            <th className="p-3 border border-[#f2bd1d]">Nama Jabatan</th>
            <th className="p-3 border border-[#f2bd1d]">Unit Kerja</th>
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>
            <th className="p-3 border border-[#f2bd1d]">Jenis</th>
            <th className="p-3 border border-[#f2bd1d]">Status</th>
            <th className="p-3 border border-[#f2bd1d]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-4">Tidak ada data.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-[#f2bd1d]">{item.id}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.unitkerja}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.jenis}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.status}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => openModal(true, item)}
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              {isEditMode ? "Edit Riwayat PLT/PLH" : "Tambah Riwayat PLT/PLH"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="nama">
                  Nama Jabatan
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nama"
                  name="nama"
                  type="text"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="unitkerja">
                  Unit Kerja
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="unitkerja"
                  name="unitkerja"
                  type="text"
                  value={formData.unitkerja}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="tanggalMulai">
                  Tanggal Mulai
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tanggalMulai"
                  name="tanggalMulai"
                  type="date"
                  value={formData.tanggalMulai}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="tanggalSelesai">
                  Tanggal Selesai
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tanggalSelesai"
                  name="tanggalSelesai"
                  type="date"
                  value={formData.tanggalSelesai}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3">Jenis</label>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="jenis"
                      value="PLT"
                      checked={formData.jenis === "PLT"}
                      onChange={handleInputChange}
                    />{" "}
                    PLT
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="jenis"
                      value="PLH"
                      checked={formData.jenis === "PLH"}
                      onChange={handleInputChange}
                    />{" "}
                    PLH
                  </label>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3">Status</label>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Aktif"
                      checked={formData.status === "Aktif"}
                      onChange={handleInputChange}
                    />{" "}
                    Aktif
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Inaktif"
                      checked={formData.status === "Inaktif"}
                      onChange={handleInputChange}
                    />{" "}
                    Inaktif
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                  type="button"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  {isEditMode ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPltplh;