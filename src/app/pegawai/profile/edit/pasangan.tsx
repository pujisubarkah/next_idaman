"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";

const RiwayatPasangan = () => {
  interface DataPasangan {
    no: number;
    nik: string;
    namaPasangan: string;
    jenisKelamin: string;
    tempatTanggalLahir: string;
    tanggalnikah: string;
    memperolehTunjangan: string;
    pendidikan: string;
    pekerjaan: string;
    keterangan: string;
  }

  const [data, setData] = useState<DataPasangan[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nik: "",
    namaPasangan: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    tanggalNikah: "",
    memperolehTunjangan: "",
    pendidikan: "",
    pekerjaan: "",
    keterangan: "",
    bekerjaDiLAN: "",
    nipASN: "",
  });

  const pendidikanOptions: { value: string; label: string }[] = [
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA" },
    { value: "D3", label: "D3" },
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
  ];

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);

    if (nipFromUrl) {
      fetchRiwayatPasangan(nipFromUrl);
    }
  }, []);

  const formatTanggal = (tanggal: string) => {
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

  const fetchRiwayatPasangan = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat?peg_id=${nip}&riw_status=4`);
      const sortedData = response.data.sort((a: any, b: any) =>
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()
      );

      const mappedData = sortedData.map((item: any, index: number) => ({
        no: index + 1,
        nik: item.nik,
        namaPasangan: item.riw_nama,
        jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",
        tempatTanggalLahir: `${item.riw_tempat_lahir}, ${formatTanggal(item.riw_tgl_lahir)}`,
        tanggalnikah: formatTanggal(item.riw_tgl_ket),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption: any) => {
    setFormData((prevData) => ({
      ...prevData,
      pendidikan: selectedOption?.value || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Add your submission logic (API request)
    try {
      await axios.post(`/api/riwayat`, { ...formData, peg_id: nip });
      fetchRiwayatPasangan(nip!);
      closeModal();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const openModal = () => {
    setFormData({
      nik: "",
      namaPasangan: "",
      jenisKelamin: "",
      tempatLahir: "",
      tanggalLahir: "",
      tanggalNikah: "",
      memperolehTunjangan: "",
      pendidikan: "",
      pekerjaan: "",
      keterangan: "",
      bekerjaDiLAN: "",
      nipASN: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (item: DataPasangan) => {
    setFormData({
      nik: item.nik,
      namaPasangan: item.namaPasangan,
      jenisKelamin: item.jenisKelamin === "Laki-laki" ? "L" : "P",
      tempatLahir: item.tempatTanggalLahir.split(", ")[0],
      tanggalLahir: new Date(item.tempatTanggalLahir.split(", ")[1]).toISOString().split("T")[0],
      tanggalNikah: new Date(item.tanggalnikah).toISOString().split("T")[0],
      memperolehTunjangan: item.memperolehTunjangan === "Ya" ? "true" : "false",
      pendidikan: item.pendidikan,
      pekerjaan: item.pekerjaan,
      keterangan: item.keterangan,
      bekerjaDiLAN: "",
      nipASN: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (nik: string) => {
    try {
      await axios.delete(`/api/riwayat/${nik}`);
      fetchRiwayatPasangan(nip!);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div id="pasangan-container">
      <div id="pasangan" className="p-8">
        <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT PASANGAN</h3>

        <div className="flex justify-end mb-4">
          <button
            className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
            onClick={openModal}
          >
            <FaPlus className="inline-block mr-2" />
            Tambah Pasangan
          </button>
        </div>

        <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
          <thead className="bg-teal-900 text-white">
            <tr>
              <th className="p-3 border border-teal-500">No</th>
              <th className="p-3 border border-teal-500">NIK</th>
              <th className="p-3 border border-teal-500">Nama Pasangan</th>
              <th className="p-3 border border-teal-500">Jenis Kelamin</th>
              <th className="p-3 border border-teal-500">Tempat dan Tanggal Lahir</th>
              <th className="p-3 border border-teal-500">Tanggal Nikah</th>
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
                  <td className="p-3 border border-teal-500">{item.namaPasangan}</td>
                  <td className="p-3 border border-teal-500">{item.jenisKelamin}</td>
                  <td className="p-3 border border-teal-500">{item.tempatTanggalLahir}</td>
                  <td className="p-3 border border-teal-500">{item.tanggalnikah}</td>
                  <td className="p-3 border border-teal-500">{item.memperolehTunjangan}</td>
                  <td className="p-3 border border-teal-500">{item.pendidikan}</td>
                  <td className="p-3 border border-teal-500">{item.pekerjaan}</td>
                  <td className="p-3 border border-teal-500">{item.keterangan}</td>
                  <td className="p-3 border border-teal-500">
                    <div className="flex space-x-4">
                      <button  className="text-green-500 hover:text-green-700" onClick={() => handleEdit(item)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.nik)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Tambah Data Pasangan</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <label htmlFor="nik" className="block text-sm font-semibold w-1/3">NIK</label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4 flex items-center">
                <label htmlFor="namaPasangan" className="block text-sm font-semibold w-1/3">Nama</label>
                <input
                  type="text"
                  id="namaPasangan"
                  name="namaPasangan"
                  value={formData.namaPasangan}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="tempatLahir" className="block text-sm font-semibold w-1/3">Tempat Lahir</label>
                <input
                  type="text"
                  id="tempatLahir"
                  name="tempatLahir"
                  value={formData.tempatLahir}
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
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="tanggalNikah" className="block text-sm font-semibold w-1/3">Tanggal Nikah</label>
                <input
                  type="date"
                  id="tanggalNikah"
                  name="tanggalNikah"
                  value={formData.tanggalNikah}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
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
                  name="nipASN"
                  value={formData.nipASN}
                  onChange={handleChange}
                  className="w-2/3 border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="memperolehTunjangan" className="block text-sm font-semibold w-1/3">Memperoleh Tunjangan</label>
                <input
                  type="text"
                  id="memperolehTunjangan"
                  name="memperolehTunjangan"
                  value={formData.memperolehTunjangan}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="pendidikan" className="block text-sm font-semibold w-1/3">Pendidikan</label>
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
                  value={formData.pekerjaan}
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
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPasangan;
