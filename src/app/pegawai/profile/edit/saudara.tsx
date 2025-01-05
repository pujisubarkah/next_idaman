"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const DataSaudaraLainnya = () => {
  interface DataSaudara {
    no: number;
    nikNip: string;
    namaSaudara: string;
    hubungan: string;
    jenisKelamin: string;
    tempatTanggalLahir: string;
    pendidikan: string;
    pekerjaan: string;
    keterangan: string;
  }

  const [dataSaudara, setDataSaudara] = useState<DataSaudara[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataSaudara>({
    no: 0,
    nikNip: "",
    namaSaudara: "",
    hubungan: "",
    jenisKelamin: "",
    tempatTanggalLahir: "",
    pendidikan: "",
    pekerjaan: "",
    keterangan: "",
  });

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

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);

    if (nipFromUrl) {
      fetchRiwayatSaudara(nipFromUrl);
    }
  }, []);

  const fetchRiwayatSaudara = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat?peg_id=${nip}&riw_status=2`);
      const sortedData = response.data.sort((a: any, b: any) =>
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()
      );

      const mappedData = sortedData.map((item: any, index: number) => ({
        no: index + 1,
        nikNip: item.nik,
        namaSaudara: item.riw_nama,
        hubungan: item.riw_ket,
        jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",
        tempatTanggalLahir: `${item.riw_tempat_lahir},  ${formatTanggal(item.riw_tgl_lahir)}`,
        pendidikan: item.riw_pendidikan,
        pekerjaan: item.riw_pekerjaan,
        keterangan: item.riw_ket,
      }));

      setDataSaudara(mappedData);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    closeModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="saudara" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-6">DATA SAUDARA LAINNYA</h3>

      <div className="mb-8 p-4 bg-teal-100 border border-teal-500 rounded-lg">
        <h4 className="font-bold text-teal-900">PETUNJUK:</h4>
        <ul className="list-decimal list-inside mt-2 text-teal-800">
          <li>Untuk saudara kandung, mohon input seluruhnya.</li>
          <li>
            Selain saudara kandung, mohon input semua yang bekerja di Lembaga Administrasi Negara,
            baik sebagai ASN ataupun Non ASN.
          </li>
        </ul>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={openModal} className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FaPlus className="inline-block mr-2" />
          Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th className="p-3 border border-teal-500">No</th>
            <th className="p-3 border border-teal-500">NIK/NIP</th>
            <th className="p-3 border border-teal-500">Nama Saudara</th>
            <th className="p-3 border border-teal-500">Hubungan</th>
            <th className="p-3 border border-teal-500">Jenis Kelamin</th>
            <th className="p-3 border border-teal-500">Tempat dan Tanggal Lahir</th>
            <th className="p-3 border border-teal-500">Pendidikan</th>
            <th className="p-3 border border-teal-500">Pekerjaan</th>
            <th className="p-3 border border-teal-500">Keterangan</th>
            <th className="p-3 border border-teal-500">Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {dataSaudara.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center p-4">
                Data tidak ditemukan.
              </td>
            </tr>
          ) : (
            dataSaudara.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.nikNip}</td>
                <td className="p-3 border border-teal-500">{item.namaSaudara}</td>
                <td className="p-3 border border-teal-500">{item.hubungan}</td>
                <td className="p-3 border border-teal-500">{item.jenisKelamin}</td>
                <td className="p-3 border border-teal-500">{item.tempatTanggalLahir}</td>
                <td className="p-3 border border-teal-500">{item.pendidikan}</td>
                <td className="p-3 border border-teal-500">{item.pekerjaan}</td>
                <td className="p-3 border border-teal-500">{item.keterangan}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
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
            <h3 className="text-xl font-semibold mb-4">Tambah Data Saudara</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <label htmlFor="nikNip" className="block text-sm font-semibold w-1/3">NIK/NIP</label>
                <input
                  type="text"
                  id="nikNip"
                  name="nikNip"
                  value={formData.nikNip}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="namaSaudara" className="block text-sm font-semibold w-1/3">Nama Saudara</label>
                <input
                  type="text"
                  id="namaSaudara"
                  name="namaSaudara"
                  value={formData.namaSaudara}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="hubungan" className="block text-sm font-semibold w-1/3">Hubungan</label>
                <div className="w-2/3 flex flex-wrap">
                  {["Saudara Kandung", "Sepupu", "Keponakan", "Menantu", "Mertua", "Ipar", "Paman", "Bibi", "Kerabat Jauh", "Kakak", "Adik", "Saudara Tiri"].map((option) => (
                    <div key={option} className="flex items-center mr-4 mb-2">
                      <input
                        type="radio"
                        id={option}
                        name="hubungan"
                        value={option}
                        checked={formData.hubungan === option}
                        onChange={handleChange}
                        className="mr-1"
                        required
                      />
                      <label htmlFor={option} className="text-sm">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="jenisKelamin" className="block text-sm font-semibold w-1/3">Jenis Kelamin</label>
                <div className="w-2/3 flex flex-wrap">
                  <div className="flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      id="laki-laki"
                      name="jenisKelamin"
                      value="Laki-laki"
                      checked={formData.jenisKelamin === "Laki-laki"}
                      onChange={handleChange}
                      className="mr-1"
                      required
                    />
                    <label htmlFor="laki-laki" className="text-sm">Laki-laki</label>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      id="perempuan"
                      name="jenisKelamin"
                      value="Perempuan"
                      checked={formData.jenisKelamin === "Perempuan"}
                      onChange={handleChange}
                      className="mr-1"
                      required
                    />
                    <label htmlFor="perempuan" className="text-sm">Perempuan</label>
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="tempatTanggalLahir" className="block text-sm font-semibold w-1/3">Tempat dan Tanggal Lahir</label>
                <input
                  type="text"
                  id="tempatTanggalLahir"
                  name="tempatTanggalLahir"
                  value={formData.tempatTanggalLahir}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="pendidikan" className="block text-sm font-semibold w-1/3">Pendidikan</label>
                <input
                  type="text"
                  id="pendidikan"
                  name="pendidikan"
                  value={formData.pendidikan}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded"
                  required
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

export default DataSaudaraLainnya;
