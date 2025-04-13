"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatKepangkatan = () => {
  interface DataPangkat {
    no: number;
    golRuang: string;
    masaKerjaTahun: string;
    masaKerjaBulan: string;
    nomorSK: string;
    tanggalSK: string;
    jabatanPenandatangan: string;
    tmt: string;
    unitKerja: string;
  }

  const [data, setData] = useState<DataPangkat[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<DataPangkat>({
    no: 0,
    golRuang: '',
    masaKerjaTahun: '',
    masaKerjaBulan: '',
    nomorSK: '',
    tanggalSK: '',
    jabatanPenandatangan: '',
    tmt: '',
    unitKerja: '',
  });

  // Function to format date
  const formatTanggal = (tanggal: string) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} ${bulan} ${tahun}`;
  };

  const fetchRiwayatPangkat = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/pangkat?peg_id=${nip}`);
      const mappedData = response.data.map((item: any, index: number) => ({
        no: index + 1,
        golRuang: item.nama_golongan,
        masaKerjaTahun: item.riw_pangkat_thn,
        masaKerjaBulan: item.riw_pangkat_bln,
        nomorSK: item.riw_pangkat_sk,
        tanggalSK: formatTanggal(item.riw_pangkat_sktgl),
        jabatanPenandatangan: item.riw_pangkat_pejabat,
        tmt: formatTanggal(item.riw_pangkat_tmt),
        unitKerja: item.riw_pangkat_unit_kerja,
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
      fetchRiwayatPangkat(nip);
    }
  }, [nip]);

  const openModal = (isEdit: boolean, data: DataPangkat | null = null) => {
    setIsModalOpen(true);
    setIsEditMode(isEdit);
    if (isEdit && data) {
      setFormData(data);
    } else {
      setFormData({
        no: 0,
        golRuang: '',
        masaKerjaTahun: '',
        masaKerjaBulan: '',
        nomorSK: '',
        tanggalSK: '',
        jabatanPenandatangan: '',
        tmt: '',
        unitKerja: '',
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing data
        await axios.put(`/api/riwayat/pangkat/${formData.no}`, formData);
      } else {
        // Add new data
        await axios.post(`/api/riwayat/pangkat`, formData);
      }
      fetchRiwayatPangkat(nip!); // Refresh data
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div id="kepangkatan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">RIWAYAT KEPANGKATAN</h3>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal(false)}
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">No</th>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Gol. Ruang</th>
            <th colSpan={2} className="p-3 border border-[#f2bd1d]">Masa Kerja</th>
            <th colSpan={3} className="p-3 border border-[#f2bd1d]">Surat Keputusan</th>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">TMT</th>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Unit Kerja</th>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-[#f2bd1d]">Tahun</th>
            <th className="p-3 border border-[#f2bd1d]">Bulan</th>
            <th className="p-3 border border-[#f2bd1d]">Nomor</th>
            <th className="p-3 border border-[#f2bd1d]">Tanggal</th>
            <th className="p-3 border border-[#f2bd1d]">Jabatan Penandatangan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.golRuang}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.masaKerjaTahun}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.masaKerjaBulan}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.nomorSK}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSK}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tmt}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.unitKerja}</td>
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

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              {isEditMode ? "Edit Riwayat Kepangkatan" : "Tambah Riwayat Kepangkatan"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="golRuang">
                  Gol Ruang
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="golRuang"
                  name="golRuang"
                  type="text"
                  value={formData.golRuang}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="masaKerjaTahun">
                  Masa Kerja Tahun
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="masaKerjaTahun"
                  name="masaKerjaTahun"
                  type="text"
                  value={formData.masaKerjaTahun}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="masaKerjaBulan">
                  Masa Kerja Bulan
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="masaKerjaBulan"
                  name="masaKerjaBulan"
                  type="text"
                  value={formData.masaKerjaBulan}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="nomorSK">
                  Nomor SK
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nomorSK"
                  name="nomorSK"
                  type="text"
                  value={formData.nomorSK}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="tanggalSK">
                  Tanggal SK
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tanggalSK"
                  name="tanggalSK"
                  type="date"
                  value={formData.tanggalSK}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="jabatanPenandatangan">
                  Jabatan Penandatangan SK
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="jabatanPenandatangan"
                  name="jabatanPenandatangan"
                  type="text"
                  value={formData.jabatanPenandatangan}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="tmt">
                  TMT
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tmt"
                  name="tmt"
                  type="date"
                  value={formData.tmt}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="unitKerja">
                  Unit Kerja
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="unitKerja"
                  name="unitKerja"
                  type="text"
                  value={formData.unitKerja}
                  onChange={handleInputChange}
                  required
                />
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

export default RiwayatKepangkatan;