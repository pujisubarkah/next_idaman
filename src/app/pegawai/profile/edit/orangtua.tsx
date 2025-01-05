"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import Select from "react-select"; // Ensure this is imported if using react-select

const RiwayatOrangTua = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [data, setData] = useState<DataDummy[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({}); // Define formData state

  interface DataDummy {
    no: number;
    nik: string;
    namaAnak: string;
    jenisKelamin: string;
    tempatTanggalLahir: string;
    statusPerkawinan: string;
    memperolehTunjangan: string;
    pendidikan: string;
    pekerjaan: string;
    keterangan: string;
  }

  // Options for pendidikan
  const pendidikanOptions = [
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA" },
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
  ];

  // Function to format date
  const formatTanggal = (tanggal) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} - ${bulan} - ${tahun}`;
  };

  useEffect(() => {
    // Get NIP from URL
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);

    if (nipFromUrl) {
      // Fetch data from API
      fetchRiwayatAnak(nipFromUrl);
    }
  }, []);

  const fetchRiwayatAnak = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat?peg_id=${nip}&riw_status=3`);
      const sortedData = response.data.sort((a: any, b: any) =>
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()
      );

      const mappedData = sortedData.map((item: any, index: number) => ({
        no: index + 1,
        nik: item.nik,
        namaAnak: item.riw_nama,
        jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",
        tempatTanggalLahir: `${item.riw_tempat_lahir}, ${formatTanggal(item.riw_tgl_lahir)}`,
        statusPerkawinan: item.riw_status_perkawinan,
        memperolehTunjangan: item.riw_status_tunj ? "Ya" : "Tidak",
        pendidikan: item.riw_pendidikan,
        pekerjaan: item.riw_pekerjaan,
        keterangan: item.riw_ket,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prevData) => ({ ...prevData, pendidikan: selectedOption.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, aktaAnak: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Form submitted:", formData);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <div id="orangtua" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT ORANG TUA</h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="inline-block mr-2" />
          Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th className="p-3 border border-teal-500">No</th>
            <th className="p-3 border border-teal-500">NIK</th>
            <th className="p-3 border border-teal-500">Nama Anak</th>
            <th className="p-3 border border-teal-500">Jenis Kelamin</th>
            <th className="p-3 border border-teal-500">Tempat dan Tanggal Lahir</th>
            <th className="p-3 border border-teal-500">Status Perkawinan</th>
            <th className="p-3 border border-teal-500">Memperoleh Tunjangan</th>
            <th className="p-3 border border-teal-500">Pendidikan</th>
            <th className="p-3 border border-teal-500">Pekerjaan</th>
            <th className="p-3 border border-teal-500">Keterangan</th>
            <th className="p-3 border border-teal-500">Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center p-4">
                Data tidak ditemukan.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.nik}</td>
                <td className="p-3 border border-teal-500">{item.namaAnak}</td>
                <td className="p-3 border border-teal-500">
                  {item.jenisKelamin}
                </td>
                <td className="p-3 border border-teal-500">
                  {item.tempatTanggalLahir}
                </td>
                <td className="p-3 border border-teal-500">
                  {item.statusPerkawinan}
                </td>
                <td className="p-3 border border-teal-500">
                  {item.memperolehTunjangan}
                </td>
                <td className="p-3 border border-teal-500">{item.pendidikan}</td>
                <td className="p-3 border border-teal-500">{item.pekerjaan}</td>
                <td className="p-3 border border-teal-500">{item.keterangan}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                      onClick={() => {
                        setIsEditing(true);
                        setFormData(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
                      onClick={() => {
                        // Handle delete logic
                      }}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? "Edit Data Anak" : "Tambah Data Anak"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <label htmlFor="nik" className="block text-sm font-semibold w-1/3">NIK</label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  value={formData.nik || ""}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4 flex items-center">
                <label htmlFor="namaAnak" className="block text-sm font-semibold w-1/3">Nama </label>
                <input
                  type="text"
                  id="namaAnak"
                  name="namaAnak"
                  value={formData.namaAnak || ""}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4 flex items-center">
                <label className="block text-sm font-semibold w-1/3">Jenis Kelamin</label>
                <div className="w-2/3 flex items-center">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Laki-laki"
                      checked={formData.jenisKelamin === "Laki-laki"}
                      onChange={handleChange}
                    />
                    Laki-laki
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Perempuan"
                      checked={formData.jenisKelamin === "Perempuan"}
                      onChange={handleChange}
                    />
                    Perempuan
                  </label>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <label className="block text-sm font-semibold w-1/3">Bekerja di LAN</label>
                <div className="w-2/3 flex items-center">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="bekerjaDiLAN"
                      value="Ya"
                      checked={formData.bekerjaDiLAN === "Ya"}
                      onChange={handleChange}
                    />
                    Ya
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="bekerjaDiLAN"
                      value="Tidak"
                      checked={formData.bekerjaDiLAN === "Tidak"}
                      onChange={handleChange}
                    />
                    Tidak
                  </label>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <label className="block text-sm font-semibold w-1/3">NIP (jika ASN)</label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip || ""}
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 p-2"
                />
              </div>

              <div className="mb-4 flex items-center">
                <label htmlFor="tempatLahir" className="block text-sm font-semibold w-1/3">Tempat Lahir</label>
                <input
                  type="text"
                  id="tempatLahir"
                  name="tempatLahir"
                  value={formData.tempatLahir || ""}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4 flex items-center">
                <label htmlFor="tanggalLahir" className="block text-sm font-semibold w-1/3">Tanggal Lahir</label>
                <input
                  type="date"
                  id="tanggalLahir"
                  name="tanggalLahir"
                  value={formData.tanggalLahir || ""}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>

                         

              <div className="mb-4 flex items-center">
                <label className="block text-sm font-semibold w-1/3">Pendidikan</label>
                <Select
                  value={pendidikanOptions.find(option => option.value === formData.pendidikan)}
                  onChange={handleSelectChange}
                  options={pendidikanOptions}
                  className="w-2/3 basic-single"
                  classNamePrefix="select"
                />
              </div>

              <div className="mb-4 flex items-center">
                <label htmlFor="pekerjaan" className="block text-sm font-semibold w-1/3">Pekerjaan</label>
                <input
                  type="text"
                  id="pekerjaan"
                  name="pekerjaan"
                  value={formData.pekerjaan || ""}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="keterangan" className="block text-sm font-semibold w-1/3">Keterangan</label>
                <textarea
                  id="keterangan"
                  name="keterangan"
                  value={formData.keterangan}
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
                  className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
                >
                  {isEditing ? "Simpan Perubahan" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatOrangTua;
