"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const RiwayatAnak = () => {
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

  // Fungsi untuk memformat tanggal
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

  useEffect(() => {
    // Mendapatkan NIP dari URL
    const path = window.location.pathname;
    const segments = path.split("/"); // Memecah URL menjadi array
    const nipFromUrl = segments[segments.length - 1]; // Ambil elemen terakhir (NIP)
    setNip(nipFromUrl);
  }, []); // Hanya dijalankan sekali ketika komponen pertama kali dimuat

  useEffect(() => {
    if (nip) {
      // Fetch data hanya jika nip tersedia
      fetchRiwayatAnak(nip);
    }
  }, [nip]); // Dependency pada nip, hanya akan dijalankan ketika nip berubah

  return (
    <div id="anak" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT ANAK</h3>

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

export default RiwayatAnak;
