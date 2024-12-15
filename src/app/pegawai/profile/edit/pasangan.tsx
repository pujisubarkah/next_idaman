"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

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
      fetchRiwayatAnak(nipFromUrl);
    }
  }, []);


     // Tentukan nama kolom berdasarkan nilai riw_ket
  const columnName = data.length > 0 ? `Nama ${data[0].keterangan}` : "Nama";
  const pageTitle = data.length > 0 ? `RIWAYAT ${data[0].keterangan.toUpperCase()}` : "RIWAYAT";

  const fetchRiwayatAnak = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat?peg_id=${nip}&riw_status=4`);
      const sortedData = response.data.sort((a: any, b: any) =>
        new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()
      );

     // Mapping data dengan formatTanggal
const mappedData = sortedData.map((item: any, index: number) => ({
  no: index + 1,
  nik: item.nik,
  namaPasangan: item.riw_nama,
  jenisKelamin: item.riw_kelamin === "L" ? "Laki-laki" : "Perempuan",
  tempatTanggalLahir: `${item.riw_tempat_lahir}, ${formatTanggal(item.riw_tgl_lahir)}`, // Format tanggal
  tanggalnikah: formatTanggal(item.riw_tgl_ket), // Format tanggal
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

  return (
    <div id="pasangan" className="p-8">
     <h3 className="text-center text-xl font-semibold mb-8">{pageTitle}</h3> {/* Judul Dinamis */}

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
            <th className="p-3 border border-teal-500">NIK</th>
            <th className="p-3 border border-teal-500">{columnName}</th> {/* Nama kolom dinamis */}
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
                <td className="p-3 border border-teal-500">
                  {item.jenisKelamin}
                </td>
                <td className="p-3 border border-teal-500">
                  {item.tempatTanggalLahir}
                </td>
                <td className="p-3 border border-teal-500">
                  {item.tanggalnikah}
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

export default RiwayatPasangan;
