"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import Select from "react-select"; // Import react-select

const RiwayatAnak = () => {
  const formatTanggal = (tanggal: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  };

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

  const [data, setData] = useState<DataDummy[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    namaAnak: '',
    jenisKelamin: '',
    bekerjaDiLAN: '',
    nip: '',
    tempatLahir: '',
    tanggalLahir: '',
    statusPerkawinan: '',
    memperolehTunjangan: '',
    pendidikan: '',
    pekerjaan: '',
    aktaAnak: null as File | null,
  });

  const pendidikanOptions = [
    { value: 'SD', label: 'SD' },
    { value: 'SMP', label: 'SMP' },
    { value: 'SMA', label: 'SMA' },
    { value: 'S1', label: 'S1' },
    { value: 'S2', label: 'S2' },
    { value: 'S3', label: 'S3' },
  ];

  const fetchRiwayatAnak = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat?peg_id=${nip}&riw_status=1`);
      const sortedData = response.data.sort((a: any, b: any) =>
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()
      );

      const mappedData = sortedData.map((item: any, index: number) => ({
        no: index + 1,
        nik: item.nik,
        namaAnak: item.riw_nama,
        jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",
        tempatTanggalLahir: `${item.riw_tempat_lahir}, ${formatTanggal(item.riw_tgl_lahir)}`,
        statusPerkawinan: item.riw_status_perkawinan === "1" ? "Sudah Menikah" : "Belum Menikah",
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

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);
  }, []);

  useEffect(() => {
    if (nip) {
      fetchRiwayatAnak(nip);
    }
  }, [nip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption: any) => {
    setFormData((prev) => ({ ...prev, pendidikan: selectedOption.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Add your submission logic (API request)
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nik', formData.nik);
      formDataToSend.append('namaAnak', formData.namaAnak);
      formDataToSend.append('jenisKelamin', formData.jenisKelamin);
      formDataToSend.append('bekerjaDiLAN', formData.bekerjaDiLAN);
      formDataToSend.append('nip', formData.nip);
      formDataToSend.append('tempatLahir', formData.tempatLahir);
      formDataToSend.append('tanggalLahir', formData.tanggalLahir);
      formDataToSend.append('statusPerkawinan', formData.statusPerkawinan);
      formDataToSend.append('memperolehTunjangan', formData.memperolehTunjangan);
      formDataToSend.append('pendidikan', formData.pendidikan);
      formDataToSend.append('pekerjaan', formData.pekerjaan);
      if (formData.aktaAnak) {
        formDataToSend.append('aktaAnak', formData.aktaAnak);
      }

      if (isEditing) {
        // Edit data
        await axios.put(`/api/riwayat/${formData.nik}?riw_status=2&peg_id=${nip}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Add data
        await axios.post(`/api/riwayat?riw_status=2&peg_id=${nip}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      fetchRiwayatAnak(nip!);
      closeModal();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const openModal = () => {
    setFormData({
      nik: '',
      namaAnak: '',
      jenisKelamin: '',
      bekerjaDiLAN: '',
      nip: '',
      tempatLahir: '',
      tanggalLahir: '',
      statusPerkawinan: '',
      memperolehTunjangan: '',
      pendidikan: '',
      pekerjaan: '',
      aktaAnak: null,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (item: DataDummy) => {
    setFormData({
      nik: item.nik,
      namaAnak: item.namaAnak,
      jenisKelamin: item.jenisKelamin === "Laki-laki" ? "Laki-laki" : "Perempuan",
      bekerjaDiLAN: "",
      nip: "",
      tempatLahir: item.tempatTanggalLahir.split(", ")[0],
      tanggalLahir: new Date(item.tempatTanggalLahir.split(", ")[1]).toISOString().split("T")[0],
      statusPerkawinan: item.statusPerkawinan === "Sudah Menikah" ? "Kawin" : "Belum Kawin",
      memperolehTunjangan: item.memperolehTunjangan === "Ya" ? "Ya" : "Tidak",
      pendidikan: item.pendidikan,
      pekerjaan: item.pekerjaan,
      aktaAnak: null,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (nik: string) => {
    try {
      await axios.delete(`/api/riwayat/${nik}`);
      fetchRiwayatAnak(nip!);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div id="anak" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT ANAK</h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
          onClick={openModal}
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
                <td className="p-3 border border-teal-500">{item.jenisKelamin}</td>
                <td className="p-3 border border-teal-500">{item.tempatTanggalLahir}</td>
                <td className="p-3 border border-teal-500">{item.statusPerkawinan}</td>
                <td className="p-3 border border-teal-500">{item.memperolehTunjangan}</td>
                <td className="p-3 border border-teal-500">{item.pendidikan}</td>
                <td className="p-3 border border-teal-500">{item.pekerjaan}</td>
                <td className="p-3 border border-teal-500">{item.keterangan}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                       className="text-green-500 hover:text-green-700"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item.nik)}
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
                  value={formData.nik}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4 flex items-center">
                <label htmlFor="namaAnak" className="block text-sm font-semibold w-1/3">Nama Anak</label>
                <input
                  type="text"
                  id="namaAnak"
                  name="namaAnak"
                  value={formData.namaAnak}
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
                  value={formData.nip}
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
                <label className="block text-sm font-semibold w-1/3">Status Perkawinan</label>
                <div className="w-2/3 flex items-center">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="statusPerkawinan"
                      value="Kawin"
                      checked={formData.statusPerkawinan === "Kawin"}
                      onChange={handleChange}
                    />
                    Kawin
                  </label>
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="statusPerkawinan"
                      value="Belum Kawin"
                      checked={formData.statusPerkawinan === "Belum Kawin"}
                      onChange={handleChange}
                    />
                    Belum Kawin
                  </label>
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="statusPerkawinan"
                      value="Janda"
                      checked={formData.statusPerkawinan === "Janda"}
                      onChange={handleChange}
                    />
                    Janda
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="statusPerkawinan"
                      value="Duda"
                      checked={formData.statusPerkawinan === "Duda"}
                      onChange={handleChange}
                    />
                    Duda
                  </label>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-sm font-semibold w-1/3">Memperoleh Tunjangan</label>
                <div className="w-2/3 flex items-center">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="memperolehTunjangan"
                      value="Ya"
                      checked={formData.memperolehTunjangan === "Ya"}
                      onChange={handleChange}
                    />
                    Ya
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="memperolehTunjangan"
                      value="Tidak"
                      checked={formData.memperolehTunjangan === "Tidak"}
                      onChange={handleChange}
                    />
                    Tidak
                  </label>
                </div>
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
                  value={formData.pekerjaan}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="aktaAnak" className="block text-sm font-semibold w-1/3">File Akta Anak</label>
                <input
                  type="file"
                  id="aktaAnak"
                  name="aktaAnak"
                  onChange={handleFileChange}
                  className="w-2/3 px-4 py-2 border rounded"
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

export default RiwayatAnak;
