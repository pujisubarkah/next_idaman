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

  // const [data, setData] = useState<DataDummy[]>([]);
  const [nip, setNip] = useState<string | null>(null);

// Fungsi untuk memformat tanggal
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
    // Mendapatkan NIP dari URL
    const path = window.location.pathname;
    const segments = path.split("/"); // Memecah URL menjadi array
    const nipFromUrl = segments[segments.length - 1]; // Ambil elemen terakhir (NIP)
    setNip(nipFromUrl);

    if (nipFromUrl) {
      // Fetch data dari API
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

  return (
    <div id="saudara" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-6">DATA SAUDARA LAINNYA</h3>

      {/* Keterangan Petunjuk */}
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
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
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
    </div>
  );
};

export default DataSaudaraLainnya;
